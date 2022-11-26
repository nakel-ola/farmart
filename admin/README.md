# Farmart Admin

## Table of contents

- [Introduction](#introduction)
- [Run](#run)
- [Technology](#technology)
- [Features](#features)
- [License](#license)


## Introduction

A virtual ecommerce website created with next.js.

## Run

To run this application, you have to set your own environmental variables. For security reasons, some variables have been hidden from view and used as environmental variables with the help of dotenv package. Below are the variables that you need to set in order to run the application:

- SERVER_URL: enter your server url here.

Now you can run `npm run dev` in the terminal and the application should work.


## Technology

The application is built with:

- Next.js (v18.12.1).
- React (18.1.0)
- Apollo Client (3.6.9): for sending requests to the server
- Apollo upload client (17.0.0): for send image to the server
- GraphQL (v15.8.0).
- Iconsax react (0.0.8).
- Stripe: used for payment in the checkout page

## Features

The application displays a virtual bags store that contains virtual products and contact information.

- Create an account, login or logout, forget password, change password, modifying info.
- 3 level of admin access, Gold, Sliver, Bronze.
- Creating, modifying and deleting products (Gold and Sliver only).
- Creating and deleting categories (Gold and Sliver only).
- Creating, modifying and deleting banners (Gold and Sliver only).
- Applying coupon to a user (Gold and Sliver only).
- Sending inbox to a user.
- Blocking user which will prevent them from accessing there account (Gold only).
- Sending admin invite (Gold only).

## License

[![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](http://badges.mit-license.org)

- MIT License
- Copyright 2022 © [Nunu Olamilekan](https://github.com/olamilekan21)