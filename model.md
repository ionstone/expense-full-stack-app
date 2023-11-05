User (jwt)
- uuid
- name
- id
 

Transaction Type
- id
- name
- Expense,Income,Transfer
 
Transaction category
- id
- name
- type: Transaction Type
 
Transaction
- id
- date
- userId
- type : Transaction Type
- subType : Transaction Sub Type
- amount
- description

Endpoints
- GET /api/users/
- GET /api/users/:id
- POST /api/users/
- /api//addAccount
- /api//addTransactionType
- /api//addTransactionSubType
- /api//addTransaction
- /api//editTransaction