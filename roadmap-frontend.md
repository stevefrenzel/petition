**/register**

- user needs to submit first name, last name, e-mail address and password
- if the user already created an account, he / she clicks link leading to **/login**
- if user is already logged in, redirect to **/credits**

---

**/profile**

- user can submit info about his / her age, city and homepage
- submitting it leads to **/petition**
- THIS SITE ONLY APPEARS ONCE AFTER REGISTERING!!!

---

**/petition**

- user is able to draw signature in canvas and erase it to try again
- submitting the signature redirects to **/credits**

---

**/login**

- user needs to submit e-mail address and password
- if already logged in redirect to **/credits**

---

**/credits**

- text message is thanking the user for signing up and shows the signature
- link shows the recent number of participants and leads to **/signers**
- provides a link leading to **/edit**
- provides a form with button to delete signature and redirects to **/petition**

---

**/edit**

- let the user submit new information about first name, last name, e-mail address, password, age, city and homepage
- show first name, last name, e-mail address in input field, as well as age, city and homepage (if provided)
- DO NOT SHOW PASSWORD IN INPUT FIELD!!!

---

**/signers**

- lists all participants by full name
- - if homepage URL was provided, full name is a link leading to respective URL
- lists the age and city of user, if info provided 
- - if information is provided, city is a link leading to a page listing all participants from respective city