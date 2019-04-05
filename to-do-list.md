Routes

1. GET /petition √

- render petition template (that's the one with the 3 input fields and the canvas)

2. POST /petition

- render petition template with error message if there's an error
- redirect to the thank you page AFTER we set the cookie 

3. GET /credits √

- render the credits template 

4. GET /signers √

- render the signers template

-------

Templates

1. petition — page with the canvas and the first and last input fields
2. credits
3. signers
4. layout
5. (opt) partials 

-------

Queries

1. INSERT INTO signatures 
2. SELECT to get names of signers 
3. (opt) — SELECT to get number of signers 