
# Services

Services in routes should be passed wia the store method, if you cant do something you want to do them define the service you want to use inside the context.ts inside the context object and inport it from there this is to ensure for testing purposes it is still a single service that is used and later can be easily swapped 

# Prisma queries

note that if you are working with prisma and the thing does not work its probably cuz prisma is not awaited (even if you are performing an operation wjere you dont want the result)

# Elysia quirks 
sometimes when you change a path arguemnt it starts with the bad red squiggles just copy and paste it or restart the ts server