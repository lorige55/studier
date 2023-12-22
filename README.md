# Studier

The studier is still in development and has many bugs. This is why you have to install the latest version manually. I am very thankful if you could report any bugs or feature requests under the issues tab in this repository. Thanks!

## Installation

Studier can be installed by two ways: Manual or with a wizard. However they share the first step:

### Preparation

To be able to host the studier locally on your machine to use it you have to have **git** and **npm** installed.
You can find the instructions to install git here: https://git-scm.com/downloads
The easiest way to install npm is to install node.js which you can find the instructions to here: https://nodejs.org/en
If you've (already) installed them, than you're good to proceed to the next step(s).

### Installation with the wizard

Go to the Releases (https://github.com/lorige55/studier/releases/tag/script) and download "install.sh" 

Make sure to have it in the Folder were you want to install studier. Then change the file permissions, so you are able to run the script:

For Linux:
```
chmod 777 install.sh
```

Then, just run it with:

```
./install.sh
```

From now on you can always start your local web server!

```
npm run dev
```

Make sure to **stay up to date**!

### Manual Installation

Run the following command to clone this repository:

```
git clone https://github.com/lorige55/studier
```

Now navigate into the newly created directory with this command:

```
cd studier
```

Since you have NPM installed go ahead and run this command to install the necessary NPM packages:

```
npm install
```

Now the only thing left to do is start the local server:

```
npm run dev
```

This command starts a server that allows you to host your own local web-server. You can now navigate to the address the previous command gave you and enjoy studier!

## Stay up to date!

I am constantly updating the code, fixing bugs and adding new features. I really recommend to regularly run the following command to get the latest version of the studier:

```
git pull origin master
```

Make sure to run this command inside the studier directory!
