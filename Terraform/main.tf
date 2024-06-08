provider "aws" {
  region = var.region
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
}

resource "aws_vpc" "vpc" {
    cidr_block           = "10.1.0.0/16"
    enable_dns_hostnames = true
    tags = {
        Name = "${var.env_prefix}-vpc"
    }
}

data "aws_ami" "amazon_ubuntu_image" {
    most_recent = true
    owners      = ["amazon"]

    filter {
        name   = "name"
        values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-20240423"]
    }

    filter {
        name   = "virtualization-type"
        values = ["hvm"]
    }

}

resource "aws_subnet" "subnet" {
    vpc_id            = aws_vpc.vpc.id
    cidr_block        = var.subnet_cidr_block
    availability_zone = var.availability_zone
    
    tags = {
        Name = "${var.env_prefix}-subnet"
    }
}

resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.vpc.id
    tags = {
        Name = "${var.env_prefix}-internet-gateway"
    }
}

resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.vpc.id

    route{
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.igw.id
    }

    tags = {
        Name = "${var.env_prefix}-route-table"
    }
}

resource "aws_security_group" "sg" {
    name   = "${var.env_prefix}-sg"
    vpc_id = aws_vpc.vpc.id

    ingress {
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port       = 0
        to_port         = 0
        protocol        = "-1"
        cidr_blocks     = ["0.0.0.0/0"]
    }
}

resource "aws_key_pair" "ssh_key" {
    key_name   = "${var.env_prefix}-key-pair"
    public_key = file(var.ssh_key)
}

resource "aws_instance" "node-server" {
    ami                         = data.aws_ami.amazon_ubuntu_image.id
    instance_type               = var.instance_type
    key_name                    = "${aws_key_pair.ssh_key.key_name}"
    subnet_id                   = aws_subnet.subnet.id
    vpc_security_group_ids      = [aws_security_group.sg.id]
    availability_zone           = var.availability_zone

    tags = {
        Name = "${var.env_prefix}-server"
    }
}