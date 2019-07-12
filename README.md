# Petition 
###### This was a project for coding bootcamp [SPICED Academy](https://www.spiced-academy.com/).

The idea behind this project is to create an online petition that visitors can sign to make their voice heard on an issue of your choosing.

The petition can be about something ridiculous, (...) , or a matter of great seriousness. Since we are going to be working on this project for considerable amount of time, it would be best if you chose a topic that interests you. Keep in mind that we will be (...) publishing them on the web, so you should not choose a topic that would offend or alienate your colleagues or others you may want to impress with your work.

## Directory 🔎

1. [Register (Login)](https://github.com/stevefrenzel/spiced_academy_petition#1-register--login)
2. [Creating a signature](https://github.com/stevefrenzel/spiced_academy_petition#2-creating-a-signature)
3. [Main menu](https://github.com/stevefrenzel/spiced_academy_petition#3-main-menu)
4. [Showing participants](https://github.com/stevefrenzel/spiced_academy_petition#4-showing-participants)
5. [Editing user information](https://github.com/stevefrenzel/spiced_academy_petition#5-editing-user-information)

## 1. Register / Login 🔑

<img src="/images/01_register.png">

-   users table contains columns for id (the primary key), first name, last name, email address, hashed password and a timestamp column to record the time at which the user was created:

```
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(1337) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

-   both the registration and log in forms can have several errors and will display error information if necessary

-   first name, last name, email address, and password are all required fields, e-mail addresses are unique, enforced by a constraint on the column

-   logged out users are automatically redirected to the registration page

## 2. Creating a signature 📝

<img src="/images/02_signature.png">

-   client-side Javascript allows users to draw on the `<canvas>` element and then set the value of the hidden form field to what they have drawn

-   getting the image data put in the hidden field by calling the `toDataURL()` method of the canvas

-   when users submit the form, a POST request is made to server and the submitted data is inserted into a database table named signatures:

```
DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

-   using a timestamp column to record when the signature took place.

-   as the data url from the canvas can be large I used the TEXT data type for it

## 3. Main menu ⚙️

<img src="/images/03_credits.png">

-   this page shows additional content, other participants, the option to edit the user profile and to delete the signature

## 4. Showing participants 👩‍👩‍👦‍👦

<img src="/images/04_signers.png">

-   getting the data (if available) for age, city and website from user_profiles table

-   instead of showing the website link, it's linking the username with the saved url in the `href` attribute

-   city names are also links and when clicked, directing the user to a new page that shows only the people who have signed the petition that live in that city

## 5. Editing user information 🔧

<img src="/images/05_edit.png">

-   when a user submits this form, the data is written to a table named user_profiles, all of the fields are optional

```
DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(300),
    url VARCHAR (600),
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE
);
```
