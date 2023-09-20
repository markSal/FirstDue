const puppeteer = require('puppeteer'); //npm i puppeteer
const prompt = require('prompt');		//npm install prompt

/*
* Script loops through this data to automate actions
* It was converted from CSV to JSON and included inline here.  
* You can use a site like this do the conversion: https://csvjson.com/csv2json (make sure to choose minify setting)
*/

// Member information to be updated
var updates = [{
	"pid": 31454,
	"firstname": "John",
	"middlename": "A",
	"lastname": "Doe",
	"email": "jdoe@nola.gov",
	"ems_provider_level": 9925003,
	"ems_practice_level": 9925003,
	"current": "TRUE",
	"state_of_licensure": "LA",
	"state_licensure_id": "LA14-93139",
	"state_licensure_level": 9925003,
	"state_issue_date": "",
	"state_expiration_date": "09/30/2021",
	"state_certification_date": "09/30/2019",
	"national_registry_level": "",
	"national_registy_number": "",
	"national_registry_certification_date": "",
	"national_registry_expiration_date": ""
}];
	
(async () => {
	// Setup browser settings
	const browser = await puppeteer.launch({ headless: false });
	//const browser = await puppeteer.launch({ headless: false, devtools: true });
	
	// Open new page
	const page = await browser.newPage();

	
	// First Due username and password
	const username = '[USER_NAME_HERE]'; 
	const password = '[PASSWORD_HERE]';
	
	// Setup system URLs
	const loginUrl =  'https://sizeup.firstduesizeup.com/auth/signin/';
	const userInfoUrl = 'https://sizeup.firstduesizeup.com/personnel/';
	const personnelEditUrl = 'https://sizeup.firstduesizeup.com/personnel/update?id=';
	
	
	// Set browser viewport size
	await page.setViewport({ width: 1366, height: 768 });
	
	
	// Go to First Due Login page
	await page.goto(loginUrl);


	// Enter login information for First Due
	await page.type('#SigninForm_email', username);		// Username
	await page.type('#SigninForm_password', password);	// Password
	
	// Wait 5 seconds
	await page.waitForTimeout(5000);					// Wait for captcha
	
	// Click login button on First Due
	await page.click('.actions .btn[type="submit"]');

	
	// Wait for homepage to load 
	await page.waitForSelector('#app .responder', {visible: true});
	
	// 3 second buffer to ensure page is fully loaded
	await page.waitForTimeout(3000);
	
	// Go to Personnel screen in First Due
	await page.goto(userInfoUrl);
	
	// Wait for 3 seconds
	await page.waitForTimeout(3000);
	

	// Loop through supplied data	
	for(let i = 0; i < updates.length; i++){
		
		// Display message to console showing which action is being performed
		console.log('UPDATING: ' + updates[i].firstname + " " + updates[i].lastname);

		// This procedure loops through supplied data and updates member information in First Due
		
		// Go to User Profile Edit screen
		await page.goto(personnelEditUrl + updates[i].pid);

		// Wait for elements to load
		await page.waitForSelector('#app-personnel', {visible: true});

		// Update EMS Provider Level
		if(updates[i].ems_provider_level){
			await page.select('#Personnel_ems_provider_level', updates[i].ems_provider_level.toString());	// Update value
		}

		// Click Save Button
		await page.click('#app-personnel > div > div.personnel-session-container.session-content > div > div > div > div > div:nth-child(1) > button');

		
		// Wait 2 secs
		await page.waitForTimeout(2000);


		// Go to Profile NEMSIS screen
		await page.goto(personnelEditUrl + updates[i].pid + "&active=personnelNemsis");
		
		// Wait for elements to load
		await page.waitForSelector('#app-personnel', {visible: true});
		await page.waitForSelector('#ems_practice_level_code', {visible: true});
		await page.waitForSelector('#state_ems_certification_licensure_level_code', {visible: true});

		
		// Update National Registry Number
		if(updates[i].national_registy_number){
			await page.$eval("#national_registry_number", el => el.value = '');
			await page.type("#national_registry_number", updates[i].national_registy_number.toString(), {delay: 100});
		}
		
		// Update National Registry Certification Level
		if(updates[i].national_registry_level){
			await page.select('#national_registry_certification_level_code', updates[i].national_registry_level.toString());	// Update value
		}

		// Update Current National Registry Expiration Date
		if(updates[i].national_registry_expiration_date){
			await page.$eval("#current_national_registry_expiration_at", el => el.value = '');
			await page.type("#current_national_registry_expiration_at", updates[i].national_registry_expiration_date.toString(), {delay: 100});
		}
		// Press Tab key (this ensures updated value is actually saved)
		await page.keyboard.press("Tab");
		// Wait 1 sec
		await page.waitForTimeout(1000);
		
		// Update EMS Practice Level
		if(updates[i].ems_practice_level){
			await page.select('#ems_practice_level_code', updates[i].ems_practice_level.toString());	// Update value
		}

		// Update Date of Personnel's Certification or Licensure for Agency
		if(updates[i].state_certification_date){
			await page.$eval("#certification_licensure_agency_at", el => el.value = '');
			await page.type("#certification_licensure_agency_at", updates[i].state_certification_date.toString(), {delay: 100});
		}

		// Press Tab key (this ensures updated value is actually saved)
		await page.keyboard.press("Tab");

		// Update State of Licensure
		if(updates[i].state_of_licensure){
			await page.select('#licensure_state_code', updates[i].state_of_licensure.toString());	// Update value
		}
		// Wait 1 sec
		await page.waitForTimeout(1000);
		

		// Check if Licensure Information Current checkbox is checked
		if(updates[i].state_licensure_level){
			const isCurrent = await page.$("#is_current");
			const isCheckBoxChecked = await (await isCurrent.getProperty("checked")).jsonValue();
			if(!isCheckBoxChecked){
				await page.click('#is_current');
			}
		}
		
		// Update State's Licensure ID Number
		if(updates[i].state_licensure_id){
			// Focus on State Licensure ID field
			await page.focus("#state_licensure_id_number");
			await page.$eval("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(3) > div.input-field > div:nth-child(2) > #state_licensure_id_number", el => el.value = '');
			await page.type("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(3) > div.input-field > div:nth-child(2) > #state_licensure_id_number", updates[i].state_licensure_id.toString(), {delay: 100});
		}
		
		// Update State EMS Certification Licensure Level
		if(updates[i].state_licensure_level){
			await page.select('#state_ems_certification_licensure_level_code', updates[i].state_licensure_level.toString());	// Update value
		}
		
		// Press Tab key (this ensures updated value is actually saved)
		await page.keyboard.press("Tab");
		
		// Update Initial State's Licensure Issue Date
		if(updates[i].state_issue_date){
			// Focus on Initial State's Licensure Issue Date field
			await page.focus("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(5) > div > div > input");
			await page.$eval("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(5) > div > div > input", el => el.value = '');
			await page.type("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(5) > div > div > input", updates[i].state_issue_date.toString(), {delay: 100});
		}
		
		// Update Current State's Licensure Expiration Date
		if(updates[i].state_expiration_date){
			// Focus on Current State's Licensure Expiration Date field
			await page.focus("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(6) > div > div > input");
			await page.$eval("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(6) > div > div > input", el => el.value = '');
			await page.type("#create_edit_personnel_nemsis > div:nth-child(12) > div > div.form_group > div > div:nth-child(6) > div > div > input", updates[i].state_expiration_date.toString(), {delay: 100});
		}
		
		// Update State EMS Current Certification Date
		if(updates[i].state_certification_date){
			// Focus on State EMS Current Certification Date field
			await page.focus("#state_ems_current_certification_at");
			await page.$eval("#state_ems_current_certification_at", el => el.value = '');
			await page.type("#state_ems_current_certification_at", updates[i].state_certification_date.toString(), {delay: 100});
		}

		// Click Save Button
		await page.click('#create_edit_personnel_nemsis > div.personnel-accrual-header > div > div:nth-child(1) > button');

		// Wait 2 secs
		await page.waitForTimeout(2000);

		// End Loop
		// All member information should have been updated
	}

	//	Close browser
	await browser.close();
})();
