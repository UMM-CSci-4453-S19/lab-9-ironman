#####Group Members:
Joe Deglman, Kai Zang, Dexter An  
#####Group databases: 
ironman
#####APIs:
/buttons - returns a json object of the till_buttons table in the 
database  

/list - returns a json object of the items in the current_transaction 
table with non-zero amount  

/click?id=<inputID> - updates current_transaction table by increase the amount 
of the item with the specified id by 1 and the cost by the price of 
that item  

/deleteRow?id=<inputID> - sets the amount and cost fields of the item with 
the id matching the specified id in the current_transaction table  

/void - clears the current transaction table and refreshes the Item list  

/sale?user=<inputUser> - calls the sale procedure with the given user as input  


