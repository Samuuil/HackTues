# What is this 

This is an event driven extensible system for managing patients

It allows you to constantly gather ata from your patients (location, acceleration, bpm) and using this data react fast and accordingly 

# How is it done 

Well we use websockets for the primary architectire of the app, you can subcribe to events or resct to them, for example one application of this system is to use it for managing people with alzheimer whi shouldnt leave their house, using the location you have by the second you will be alrted imideately if he has left the house.

Also imagine this is not enough you want to automatically call someone when this happens well you can listen for the onNewData and if it is indded the case you can extends it to call someone (note here we are not talking for just the regular person extending ut but instead having companies use us as a base)

# Why us 

we are open source

we have an extensible api, unlike the apple watch which when you buy you can really extend it yourself using this you can use plugins made from other poeple to encahnce your experience and use cases

# Architecture

![image](https://github.com/user-attachments/assets/8c760d01-329f-4239-a208-ae5e1ff84cf3)


