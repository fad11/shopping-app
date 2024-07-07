# Shopping List App

This is a simple shopping list application built with Node.js and Express.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/fad11/shopping-app.git
```

2. Navigate to the project directory:

```bash
cd shopping-list-app
```

3. Install dependencies:

```bash
npm install express body-parser 
```

## Usage

Start the server:

```bash
npm start
```

## Running Tests

To run the tests for this application, use the following command:

```bash
npm test
```

## Routes

### Products

#### **GET /products**: Retrieve all products.

##### `Status Code`
- 200 OK: This status code indicates a successful response, returning the list of products in the response body.

##### `Response Example`
```json
[
    {
        "id": 1,
        "name": "Product 1",
        "price": 100
    },
    {
        "id": 2,
        "name": "Product 2",
        "price": 200
    }
]

```
#### **POST /products**: Add a new product.

##### `Status Codes`
- 201 Created: When a new product is successfully created, this status code is used to indicate the successful creation of the resource. The newly created product is returned in the response body.

- 400 Bad Request: This status code is returned when the request is invalid or missing required fields.

##### `Request Example`
```json
{
    "name": "Tea",
    "quantityAvailable": 1,
    "price": 4
}
```
##### `Response Example`
```json
{
    "name": "Tea",
    "quantityAvailable": 1,
    "price": 4,
    "id": "vdngvya1q"
}
```
#### **PUT /products/{productId}**: Update a product.

##### `Status Codes`
- 200 OK: The product update operation is successful, and the updated product details are returned in the response body.

- 400 Bad Request: This status code is returned when the request is invalid or missing required fields.

- 404 Not Found: This status code is returned when the product with the specified ID is not found.


##### `Request Example`
```json
{
    "name": "Tea",
    "quantityAvailable": 2,
    "price": 8,
    "id": "vdngvya1q"
}
```
##### `Response Example`
```json
{
    "name": "Tea",
    "quantityAvailable": 2,
    "price": 8,
    "id": "vdngvya1q"
}
```
#### **DELETE /products/{productId}**: Delete a product.

##### `Status Codes`
- 204 No Content: This status code indicates that the product deletion operation was successful, and there is no content to return in the response body.

- 404 Not Found: This status code is returned when the product with the specified ID is not found.

### Shopping List

#### **GET /shopping-list**: Retrieve the shopping list.

##### `Status Code`
- 200 OK: The request to retrieve the shopping list is successful, and the list along with the total cost is returned in the response body.

##### `Response Example`
```json
{
  "shoppingList": [
    {
      "name": "Tea",
      "quantityAvailable": 1,
      "price": 8,
      "id": "vdngvya1q"
    }
  ],
  "total": 10
}
```
#### **POST /shopping-list/{productId}**: Add a product to the shopping list.

##### `Status Codes`
- 201 Created: When a product is successfully added to the shopping list, this status code is used to indicate the successful addition. The response includes a message confirming the addition and the updated total cost.

- 404 Not Found: This status code is returned when the product with the specified ID is not found.

- 400 Bad Request: This status code is returned when the product is out of stock or alreadyy in shopping list.

##### `Response Example`
```json
{
  "message": "Product added to shopping list",
  "total": 8
}
```
#### **DELETE /shopping-list/{productId}**: Remove a product from the shopping list.

##### `Status Codes`
- 200 OK: The product removal operation from the shopping list is successful, and a message along with the updated total cost is returned in the response body.

- 404 Not Found: This status code is returned when the product with the specified ID is not found in the shopping list.

##### `Response Example`
```json
{
  "message": "Product removed from shopping list",
  "total": 0
}
```

### Promo Codes (Bonus)

#### **GET /promo-codes**: Retrieve all promo codes.

##### `Status Code`
- 200 OK: The request to retrieve all promo codes is successful, and the list of promo codes is returned in the response body.

#### **POST /promo-codes**: Add a new promo code.

##### `Status Codes`
- 201 Created: When a new promo code is successfully added, this status code indicates the successful creation of the promo code. The newly added promo code details are returned in the response body.

- 400 Bad Request: This status code is returned when the request is invalid or missing required fields.

#### **DELETE /promo-codes/:promoCodeId**: Delete a promo code.

##### `Status Codes`
- 204 No Content: This status code indicates that the promo code deletion operation was successful, and there is no content to return in the response body.

#### **POST /apply-promo-code/:promoCodeId**: Apply a promo code to the shopping list.

##### `Status Codes`
- 200 OK: When a promo code is successfully applied to the shopping list, this status code indicates the successful application. The response includes a message confirming the application and the updated total cost.

- 404 Not Found: This status code is returned when the promo code with the specified ID is not found.

## Docker

### Build Docker Image
```cmd
docker build -t nodejsapp:1.0.0 .
```
### Run Docker Container on port 3000
```cmd
docker run -d -p 3000:3000 nodejsapp:1.0.0
```

## Node.js Application Ansible Deployment Playbook

This playbook is designed to deploy a Node.js application using Ansible. It automates the process of installing Node.js, npm, application dependencies, and starting the Node.js application.

### Prerequisites

- Ansible installed on the control machine.
- SSH access to the target servers.
- `hosts` file configured with the IP address(es) of the target server(s).
- `ansible.cfg` file configured with necessary settings.

### Usage

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/fad11/shopping-app.git
   ```

2. Navigate to the directory containing the playbook:

   ```bash
   cd Ansible
   ```

3. Update the `hosts` file with the IP address(es) of your target server(s).

4. Update `ansible.cfg` if needed, ensuring it points to the correct inventory file.

5. Customize the playbook and roles according to your project's requirements.

6. Run the playbook:

   ```bash
   ansible-playbook playbook.yaml
   ```

### Playbook Structure

- `playbook.yaml`: Main playbook file defining tasks to be executed.
- `hosts`: Inventory file containing IP addresses or hostnames of target server(s).
- `ansible.cfg`: Ansible configuration file specifying default settings.
- `roles/nodejs/tasks/main.yml`: Role containing tasks for installing Node.js, npm, application dependencies, and starting the Node.js application.

### Customization

- **Application Path**: Update the path to your Node.js application in the `roles/nodejs/tasks/main.yml` file.
- **Node.js Version**: If you need a specific version of Node.js, you can modify the `name` parameter in the `Ensure Node.js and npm are installed` task to include the version.
- **Application Dependencies**: Adjust the `npm install` command in the playbook to install your application's dependencies.
- **SSH User and Key**: Modify the `ansible_ssh_user` and `ansible_ssh_private_key_file` variables in the `hosts` file according to your server setup.

## AWS Infrastructure Deployment using Terraform

### Overview:
The repository contains Terraform code to deploy an AWS infrastructure, including a VPC, subnet, internet gateway, route table, security group, SSH key pair, and an EC2 instance. The infrastructure is designed to host a server that can be accessed via SSH.

### Prerequisites:
Before running the Terraform scripts, ensure you have the following prerequisites:
- AWS account with appropriate permissions
- Terraform installed on your local machine
- An SSH key pair generated (the public key should be provided as `id_rsa.pub`)
- AWS access key and secret key (provide these as sensitive variables)

### Files:
- `variables.tf`: Defines input variables used in the Terraform configuration, including AWS region, VPC and subnet CIDR blocks, instance type, SSH key path, access key, secret key, and more.
- `output.tf`: Defines the output of the Terraform deployment, specifically the instance ID of the deployed EC2 instance.
- `main.tf`: Contains the main Terraform configuration, including the provider block for AWS, resource definitions for VPC, subnet, internet gateway, route table, security group, SSH key pair, and EC2 instance.
- `id_rsa.pub`: Sample SSH public key for reference. Replace this with your own SSH public key.
- `secret.tfvars`: Sample file for sensitive variables (`access_key` and `secret_key`). Replace the placeholder values with your actual AWS access key and secret key.

### Usage:
1. Clone the repository to your local machine.
2. Update the `secret.tfvars` file with your AWS access key and secret key.
3. Replace the `id_rsa.pub` file with your own SSH public key.
4. Open a terminal and navigate to the cloned directory.
5. Initialize Terraform by running:
   ```
   terraform init
   ```
6. Review the execution plan by running:
   ```
   terraform plan -var-file=secret.tfvars
   ```
7. If the plan looks good, apply the Terraform configuration by running:
   ```
   terraform apply -var-file=secret.tfvars
   ```
8. Confirm the deployment by typing `yes` when prompted.
9. Once the deployment is complete, Terraform will output the instance ID of the deployed EC2 instance.
10. You can now access your EC2 instance using the SSH key pair provided during deployment.

### Cleanup:
To clean up the resources created by this Terraform configuration, run:
```
terraform destroy -var-file=secret.tfvars
```
Confirm the destruction by typing `yes` when prompted.
