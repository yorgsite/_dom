
## **_dom.js** library reference.

This documentation have been generated from the [code source](_dom.master.js) jsdoc.


### <a name='main_menu'></a> Menu


+ [_dom](#tgt__dom)
	+ [_dom.model](#tgt__dom.model)
	+ [_dom.has](#tgt__dom.has)
	+ [_dom.instance](#tgt__dom.instance)
	+ [_dom.rule](#tgt__dom.rule)
	+ [_dom.rules](#tgt__dom.rules)
	+ [_dom.modelShadowed](#tgt__dom.modelShadowed)
	+ [_dom.modelShadow](#tgt__dom.modelShadow)

<hr/>

#### <a name="tgt__dom"></a> _dom


 creates an HTMLElement


`_dom(tagName,datas,childs,nameSpace)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **tagName** : the element tagname
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `object`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20object%20) **datas** [optional] : element attributes.
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `Array`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20Array%20) **childs** [optional] : element childs. can contain strings an html elements.
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **nameSpace** [optional] : element namesapace if any.
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `HTMLElement`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20HTMLElement%20) : a new html element

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.model"></a> _dom.model


 add a custom element to _dom.<br/> NB: the **__dom** property will be added to the element, pointing to it's interface (model instance).<br/> interface['dom'] : dom element;<br/> interface[tagName] : element tagName;


`_dom.model(tagName,constructor,cssRules,shadowed)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **tagName** : the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `function`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20function%20) **constructor** : receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor Must be a function and NOT a lambda expression because it is scoped to its interface.
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `object|function`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20object%7Cfunction%20) **cssRules** [optional] : is or returns an object describing rules like _dom.rules,<br/>but the created collection will be insancied only once and shared among interfaces.<br/>Adds the 'rules' property to the interface.
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `boolean`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20boolean%20) **shadowed** [optional] : If true, your model is instanciable via html. See _dom.modelShadow.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.has"></a> _dom.has


Checks if a model have been declared.


`_dom.has(tagName)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **tagName** : : the name of the model
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `boolean`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20boolean%20) : true if tagName exists.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.instance"></a> _dom.instance


 Instanciates a declared model;<br/> Useful if you dont want of the **__dom** property in your html element.<br/> If not, you should instead use _dom and refer to the result **__dom** attribute.


`_dom.instance(tagName,___)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **tagName**
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `...`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20...%20) **___** : whatever arguments the model constructor uses
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `ModelInstance`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20ModelInstance%20) : an object with the 'dom' property as the root HTMLElement.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.rule"></a> _dom.rule


 create a new js cssRule object;


`_dom.rule(selector,datas)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **selector** : the new rule css query.
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `object`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20object%20) **datas** [optional] : style datas.
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `CSSStyleRule`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20CSSStyleRule%20)

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.rules"></a> _dom.rules


 create a colection of cssRule objects;


`_dom.rules(datas)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `object`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20object%20) **datas** : sass like structured object
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `collection<CSSStyleRule>`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20collection%3CCSSStyleRule%3E%20)

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.modelShadowed"></a> _dom.modelShadowed


check if a model has allready been shadowed.


`_dom.modelShadowed(tagName)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **tagName** : the model name.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.modelShadow"></a> _dom.modelShadow


renders your model intanciable via html by using dom shadow


`_dom.modelShadow(tagName)`
+ ![](https://via.placeholder.com/15/1589F0/000000?text=+) `string`![](https://via.placeholder.com/100x18/cccccc/000000?text=%20string%20) **tagName** : the model name.

[▲](#main_menu)