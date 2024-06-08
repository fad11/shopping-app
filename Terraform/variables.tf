variable "region" {
    description = "The AWS region to deploy to"
    type        = string
    default     = "eu-west-2"
}

variable "vpc_cidr_block" {
    description = "The CIDR block for the VPC"
    type        = string
    default     = "172.31.0.0/16"
}

variable "subnet_cidr_block" {
    description = "The CIDR block for the subnet"
    type        = string
    default     = "172.31.16.0/20"
}

variable "env_prefix" {
    description = "The prefix to use for all resources"
    type        = string
    default     = "node"
}

variable "instance_type" {
    description = "The instance type to use for the server"
    type        = string
    default     = "t2.micro"
}

variable "availability_zone" {
    description = "The availability zone to deploy to"
    type        = string
    default     = "eu-west-2b"
}

variable "ssh_key" {
    description = "The path to the SSH public key to use for the server"
    type        = string
    default     = "id_rsa.pub"
}

variable "access_key" {
  description = "The AWS access key." 
  type = string
  sensitive = true
}

variable "secret_key" {
  description = "The AWS secret key."
  type = string
  sensitive = true
}

variable "user" {
    description = "The user to use for the Ansible playbook"
    type        = string
    default     = "ec2-user"
}