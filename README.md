<p align="center"><img src="./public/photapp.png" width="400" alt="Photapp logo"></p>

<p align="center">
<a href="https://travis-ci.org/kodejuice/photapp"><img src="https://travis-ci.org/kodejuice/photapp.svg?branch=master" alt="Build Status"></a>
</p>

## PhotApp

PhotApp is a simple photo/video sharing social network created as a learning experience. it utilizes the following technologies:

- React
- Laravel
- Typescript
- Redux
- Sass
- PaperCSS

<a href="http://photapp-web.herokuapp.com"> See live demo </a>

### Local setup

#### Requirements
  * PHP
  * NodeJS (_dev requirement_)
  * Database: MySQL

#### Install Dependencies
- `$ composer install`

#### Setup steps
1. create a `.env` file in root folder
2. copy contents of `.env.example` to the newly created `.env` file
4. make sure to set the following in the `.env`:
    - set all `DB_XXX` parameters
    - set the GOOGLE drive paramaters if you want uploads to work
5. make sure you create a mysql database by the name you've set in the `.env`
6. run `$ ./bin/setup`
7. then use `$ php artisan serve` to start the server

#### Running tests

**Backend tests:**
- `$ php artisan test`

**Frontend tests:**
- `$ npm run test`


## License

PhotApp is open-sourced software licensed under the [GPL license](https://opensource.org/licenses/GPL-3.0).
