
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


`_dom(tagName,datas,childs,nameSpace)`
+ `string` **tagName** : the element tagname
+ `object` **datas** [optional] : element attributes.
+ `Array` **childs** [optional] : element childs. can contain strings an html elements.
+ `string` **nameSpace** [optional] : element namesapace if any.
+ `HTMLElement` : 

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.model"></a> _dom.model


`_dom.model(tagName,constructor,cssRules,shadowed)`
+ `string` **tagName** : the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
+ `function` **constructor** : receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor Must be a function and NOT a lambda expression because it is scoped to its interface.
+ `object|function` **cssRules** [optional] : is or returns an object describing rules like _dom.rules,<br/>but the created collection will be insancied only once and shared among interfaces.<br/>Adds the 'rules' property to the interface.
+ `boolean` **shadowed** [optional] : If true, your model is instanciable via html. See _dom.modelShadow.

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.has"></a> _dom.has


`_dom.has(tagName)`
+ `string` **tagName** : : the name of the model
+ `boolean` : true if tagName exists.

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.instance"></a> _dom.instance


`_dom.instance(tagName,___)`
+ `string` **tagName** : 
+ `...` **___** : whatever arguments the model constructor uses
+ `ModelInstance` : an object with the 'dom' property as the root HTMLElement.

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.rule"></a> _dom.rule


`_dom.rule(selector,datas)`
+ `string` **selector** : the new rule css query.
+ `object` **datas** [optional] : style datas.
+ `CSSStyleRule` : 

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.rules"></a> _dom.rules


`_dom.rules(datas)`
+ `object` **datas** : sass like structured object
+ `collection<CSSStyleRule>` : 

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.modelShadowed"></a> _dom.modelShadowed


`_dom.modelShadowed(tagName)`
+ `string` **tagName** : the model name.

[▲ Menu](#main_menu)

<hr/>

#### <a name="tgt__dom.modelShadow"></a> _dom.modelShadow


`_dom.modelShadow(tagName)`
+ `string` **tagName** : the model name.

[▲ Menu](#main_menu)