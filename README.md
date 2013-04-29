#Shoe Playground

A collection of node.js streams examples with streaming over websockets via
shoe (sock.js). Each example is on a different branch, the master branch only
contains the Readme and the starting point for the other branches.

##Running the examples

To start the server:

```
npm install
node server
```

If you change the client.js, you have to compile it via browserify. There is
an executable for this task that uses nodemon to watch for changes:
_compile-bzndle.js_

Go to localhost:3000 and enjoy. Some exmples use console.log on the client to
print data, so it's best to fire up your dev tools.

##Examples

###Event Stream

This is the most basic exmple that creates a stream and writes data to it. The
client receives the data and displays it.

###Simple MuxDemux

Two channels that send data to the client.

###Dnode

Send commands to a dnode server.

###MuxDemux Dnode

Send commands via dnode to start and stop streams. This example uses two data
streams and one rpc stream to fullfill the task.

###MuxDemux Crdt Dnode

- Use Crdt to share a document between server and client. 
- Start and stop a process that adds data to the document. 
- Add objects to the document from the client and seperate them in a crdt-Set. 
- Use a crdt-Sequence to display the 5 largest random numbers from the server.
- Use reconnect to connect to the server after a connection failure