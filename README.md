# Maya-AR

# Setting up for the first time:
* Download the code from git to your local machine
* Open the `nginx.conf` file under `nginxServer/conf` folder
* Edit the following configuration as per your usage:

1. `listen 3000 ssl` means https connection will be listening under **3000** port. Change it however you please. Keep in mind to open the desired port in firewall from your local machine
2. Edit location of `ssl_certificate` and `ssl_certificate_key` as per your local machine like following:
```
ssl_certificate      "path_to_your_project/sslCert/server.crt";
ssl_certificate_key  "path_to_your_projectt/sslCert/server.key";
```
3. You can use your own certificate or generate as you please.
4. Under the `location` section in config file, change the root as following:
```
root "path_to_your_project";
```

* Now the nginx configuration is done. Next step: go to `nginxServer` folder and double click the **nginx.exe** file.
* Now go to your mobile browser, type: `https:your_ip:3000` (as we are using 3000 port in https)
* Enjoy the project
* **PS: Make sure your are under same network of the local machine where nginx in launched**

* Download resources from here: [resources](https://drive.google.com/file/d/1HHOIQZmNoNUMuksiH3dd-HljpIUvOABv/view?usp=sharing)
* Paste the resources folder inside the project
