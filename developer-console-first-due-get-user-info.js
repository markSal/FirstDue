/* 
* Get User Info CSV
* Go to: https://sizeup.firstduesizeup.com/user/list?pageSize=alland paste this code in developer console
*/

// Define CSV headers
var headers = ["Email","Name","Area","Roles","Dispatch Types","Dispatch Units","Send SMS","User ID"];

// Define rows array
var rows = [];

// Loop through Personnel List table rows
jQuery("main div table tbody tr").each(function(){
	
	// Define row array
	var row = [];
	
	// Loop through row cells
	jQuery(this).children('td').each(function(){
		
		// If this is cell with action links
		if(jQuery(this).attr('class') == 'actcol'){
			
			// Get link to member profile
			userLink = jQuery(this).find('a.icon-glyph-pencil').attr('href');
			userID = userLink.split('/user/update?id=');
			
			// Push Personnel ID into row array
			row.push(userID[1]);
		
		// Else, if this is a normal row cell
		}else{
		
			// Push cell text to row array
            row.push(jQuery(this).text());
			
			if(jQuery(this).text() == "All Dispatches"){
				row.push("");
            }
		}  
	});
	
	// Push row array with all cell data into rows array
	rows.push(row);
});

// Loop through rows array and format data for CSV output
var rowsContent = '';
rows.forEach(function(rowArray) {
    row = rowArray.join('","');
    rowsContent += '"' + row + '"' + "\r\n";
});

// Build CSV file
var csvContent = "data:text/csv;charset=utf-8,";

// Merget CSV headers and row content into final CSV file
csvContent += '"' + headers.join('","') + '"' + "\r\n"+ rowsContent;


// Build URI to CSV file
var encodedUri = encodeURI(csvContent);

// Create link to CSV file
var link = document.createElement("a");
link.setAttribute("href", encodedUri);

// Set CSV file name
link.setAttribute("download", "firstdue_users.csv");

// Inject link to CSV file into DOM and click link to display download dialog
document.body.appendChild(link);
link.click();
