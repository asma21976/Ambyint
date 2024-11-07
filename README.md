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

1. One of the primary challenges when dealing with large number of citizens and homeworlds is rate limiting from the external API. If too many requests are sent in a short time, the API might block access or throttle, making the process slower and potentially causing failures.

Solution:
Implement a rate-limiting mechanism that ensures the program sends requests at a manageable pace. This prevents overwhelming the API and ensures compliance with any rate limits set by a service.
Additionally, since we have many citizens that could share the same homeworld URL, caching previously fetch homeworld names can prevent redundant API calls.

2.While in the code I used a hashmap to store homeworld URLs and their corresponding names, this can quickly grow large if there are millions of unique URLs. 

Solution:
To handle this, we can replace the hashmap with an LRU cache. This type of cache stores only a limited number of the most recently accessed homeworld URLs, and when the cache reaches its limit, it will automatically evict the least recently used items. This ensures that our memory usage remains manageable while still providing quick access to frequently requested homeworld data.

3. When working with large datasets, it can be inefficient to process everything on a single machine. To handle millions of unique citizens and homeworlds, we need to think about parallel processing and distributed computing. This means splitting the task into smaller chunks that can be processed independently across multiple machines.

Solution:
One of the most well-known ways to process large datasets in parallel is using the MapReduce paradigm, which is often implemented using frameworks like Hadoop. This divides the work into a few stages, the map stage where each chunk of data is processed independently on different machines and the reduce stage, where the results from all the machines are merged together and are grouped to generate the final output. 
Additionally, you could use a distributed task queue like AWS Lambda.The large dataset is split into smaller chunks, and each chunk is sent to a seperate machine. After processing, the results are gathered and combined.





