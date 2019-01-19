

# _dom

A basic but powerful micro library for html &amp; css creation with js.

+ Easy creation of html elements and css rules.
+ Basic templating.
+ Interacts exclusively with native browser API.
No proxies or intrusive attributes except for custom models.

<hr/>

<div style="border:solid 1px #00f;"></diV>

## html

#### Instanciate html elements or structure


**_dom(tagName,datas,childs,nameSpace)**
+ `string` **tagName** : element tagname
+ *object* **datas** [optional] : element attributes.
+ *Array* **childs** [optional] : element childs. can contain strings an html elements.
+ *string* **nameSpace** [optional] : element namesapace if any.
**returns** *HTMLElement*

<u>Exemple:</u>
```javascript
var inpt=_dom('input',{type:'text',value:'hello'});
document.body.appendChild(inpt);

var div=_dom('div',{style:{border:'solid 1px #0f0'}},[
	'aaa',
	_dom('u',{},[bbb]}),
	'ccc'
]);
document.body.appendChild(div);
```
<br/>
<hr/>


#### Add custom structures to *_dom*

**_dom.model(tagName,constructor)**
+ *string* **tagName** : the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
+ *function* **constructor** : receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor is scoped to its interface.

<u>Exemple 1 :</u>

declare a new html model :

```javascript
/**
 * creates an Table of 1 line.
 * @param {string} tagName must be 'table-line'
 * @param {Array} wlist columns widths
 * @param {Array} childlist columns contents.
 * @returns {HTMLElement}
 */
_dom.model('table-line',function(tagName,wlist,childlist){
	var tdlist=[],dom_tr,dom;
	var build=function(){
		for(var i=0;i<childlist.length;i++){
			tdlist.push(_dom('td',{width:(wlist[i]?wlist[i]:'*')},[childlist[i]]));
		}
		dom_tr=_dom('tr',{},tdlist);
		dom= _dom('table',{border:'0',cellPadding:'0',cellSpacing:'0'},[
			_dom('tbody',{},[dom_tr])
		]);
	};
	/**
	 * (interfacing exemple) add a column.
	 * @param {string|HTMLElement} width  column content (when content is not set) or width
	 * @param {string|HTMLElement} content  column content
	 */
	this.push=function(width,content){
		if(!content){
			content=width;
			width='*';
		}
		if(!(content instanceof HTMLElement)){
			content=document.createTextNode(content);
		}
		var nutd=_dom('td',{width:width},[content]);
		dom_tr.appendChild(nutd);
	};
	build();
	return dom;
});

```

<u>Exemple 2 :</u>

Instanciates and interact with model interface :

```javascript
var tl=_dom('table-line',['1','*'],['000',_dom('div',{},['abc'])]);

document.body.appendChild(tl);
setTimeout(function(){
	tl.__dom.push('def');
},2000);

```
<br/>
<hr/>

## css

#### create a new js cssRule object

**_dom.rule(selector, datas)**
+ *string* **selector** : the new rule rule query selector.
+ *object* **datas** [optional] : style datas if any.
**returns** *CSSStyleRule*


<u>Exemple :</u>

Overide dynamicly css rules:
```javascript
var tableRule=_dom.rule('table',{border:'solid 1px #0f0'});

setTimeout(function(){
	tableRule.style.borderColor='#00f';
},2000);

```
<br/>
<hr/>

#### Create rules collection with sass like structures


**_dom.rules(datas)**
+ *object* **datas** : sass like structured object.
**returns** collection of *CSSStyleRule*


<u>Exemple :</u>
```javascript
var rules =_dom.rules({
	'table':{
		border:'solid 1px #0f0',
		'& td':{
			'&>div':{
				border:'solid 1px #f00',
			}
		}
	}
});

setTimeout(function(){
	rules.table.style.borderColor='#00f';
},2000);

```
