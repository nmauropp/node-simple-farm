// podemos usar isso para ler dados
const fs = require('fs');
//network capability
const http = require('http');
//personalize the URL
const url = require('url');

//===========================
// FILES


//===========================
// SERVER

const replaceTemplate = (temp, product) => {
	//variavel let para manipular o argumento da função
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.image);

	if(!product.organic) {
		output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
	}
	return output;
}

//funcao create com request e response nos parametros
const tempOverview= fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8'); 
const tempCard= fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8'); 
const tempProduct= fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8'); 


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); 

//temos todos os objetos de data.json nesse array
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	//pathName recebe o url enviado na request
	const pathName = req.url;
	

	// Overview Page
	if (pathName === '/' || pathName === '/overview'){
		
		res.writeHead(200, {'Content-type': 'html'});
		
		const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
		const output = tempOverview.replace('{%PRODUCT_CARD%', cardsHtml);

		res.end(output);
	}

	// Product Page
	 else if(pathName === '/product'){
		res.end('This is the PRODUCT');
	}
	// API
	else if(pathName === '/api'){
		//res.end('API');
			res.writeHead(200, {'Content-type': 'application/json'});
			res.end(data);
	}
		
});

//startup the server
server.listen(8000, '127.0.0.1', () => {
	console.log('Open to requests on port 8000');
});