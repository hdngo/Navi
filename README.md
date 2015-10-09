# Navi (The Pixlee)
Navi is a single page web app that allows you to search for posts on Instagram given a hashtag, and a time frame (start date and end date).

In order to run the app, first make sure that you've fork and clone the back-end repo found [here](http://github.com/hdngo/navis-wings), and follow the steps to get the server up and running.

##Setting Up the environment for Mac
After forking and cloning the back-end repo to your local environment, while in the project directory:
* Run `brew install redis` if you do not already have Redis on your computer.
* Run `redis-server /usr/local/etc/redis.conf`, the default command to kick off the Redis server.
* Run `bundle install`, to install all gem dependencies
* Run `bundle exec sidekiq`, to start up Sidekiq so that it can perform the background job of querying the Instagram API.
* Run `bundle exec rails s`, to start up the Rails server
NOTE: The client side is currently setup to use the default ports for Rails and Redis, being 3000 and 6379.

Afterwards, you can open up the client on Heroku using this [link](http://navi-the-pixlee.herokuapp.com).

##Technologies Used
* Front-end: HTML, CSS, Vanilla JS, jQuery, Instagram API
* Back-end: Ruby on Rails, Redis, Sidekiq

##User Stories
* A user can search for the posts that were recently tagged with a given hashtag and time frame.
* A user can see the results from their search.
* A user can page through multiple results.
* A user can click on the result to see the full post content.
* A user can click on a link to go to the native location of the Instagram post.
* A user should receive an 'error message' if they choose an invalid date.

##Potential Issues Found Thus Far
* When making GET requests to the Instagram API, an occasional undefined method error is generated, which causes causes the server side to pause its processing. This results in some results having undefined values and can delay a user's pagination.
* The results content may be slow to load.

##Next Steps
* Implement Back functionality.
* Implement Search History feature using the Index route of the Search controller (back-end).
* Improve styling to make the page more responsive.
* Refactor and DRY out code.
* Implement Backbone or Angular JS framework.
* Deploy Back-end to Heroku.
* Cross-browser functionality.

##Resources used:
- [Sidekiq Gem Docs](https://github.com/mperham/sidekiq)
- [Sidekiq Railscast](https://www.youtube.com/watch?v=iIXLt24f8Mg)
- [Instagram API Docs](https://instagram.com/developer/endpoints/tags/)
- [StackOverflow Midnight Date Conversion](http://stackoverflow.com/questions/3894048/what-is-the-best-way-to-initialize-a-javascript-date-to-midnight)
