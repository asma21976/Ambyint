# Ambyint
Install Dependencies (My node version - v22.4.0):
npm install

Run the Program:
npm start

Access Output:
Open a browser and navigate to http://localhost:3000/process

This will generate the citizens-super-secret-info.txt file. This process can take up to 2 minutes but you should have an output that looks like this,

ex.
Server running on port 3000
Number of unique citizens: 96
Number of unique homeworlds: 49
File saved: citizens-super-secret-info.txt

View Output:
The newly generated citizens-super-secret-info.txt file will contain citizen names grouped and sorted by homeworlds.


## Describe any challenges that made the task more difficult and how you might improve your program to handle a galaxy with millions of unique citizens and homeworlds.

that most apis do have rate limiters, and the way u handle rate limiting in an enterprise application is to just wait a but for the api ur calling to stop throttling before calling it again

