The command to generate the CSR (certificate signing request) for api.missileapp.com was:
    $ openssl req -nodes -newkey rsa:2048 -keyout api.missileapp.com.key -out api.missileapp.com.csr

The passphrase used to secure the key was: m1ss1l3P4SS

The CN used was api.missileapp.com
Country Name (2 letter code) [AU]: US
State or Province Name (full name) [Some-State]: California
Locality Name (eg, city) []: .
Organization Name (eg, company) [Internet Widgits Pty Ltd]: Spartan Missile Strike
Organizational Unit Name (eg, section) []: .
Common Name (eg, YOUR name) []: api.missileapp.com
Email Address []: admin@missileapp.com

A challenge password []:
An optional company name []:
