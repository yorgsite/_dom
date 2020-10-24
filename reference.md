
## **_dom.js** library reference.

This documentation have been generated from the [code source](_dom.master.js) jsdoc.


### <a name='main_menu'></a> Menu

+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom](#tgt__dom)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.model](#tgt__dom.model)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.has](#tgt__dom.has)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.instance](#tgt__dom.instance)
	+ ![](https://via.placeholder.com/15/0089E0/000000?text=+) [_dom.sheet](#tgt__dom.sheet)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.rule](#tgt__dom.rule)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.rules](#tgt__dom.rules)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.getRulesData](#tgt__dom.getRulesData)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.modelShadowed](#tgt__dom.modelShadowed)
	+ ![](https://via.placeholder.com/15/6600ee/000000?text=+) [_dom.modelShadow](#tgt__dom.modelShadow)

<hr/>

#### <a name="tgt__dom"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom


 Create an HTMLElement


`_dom(tagName,datas,childs,nameSpace)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **tagName** : the element tagname
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `object` **datas** [optional] : element attributes.
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `Array` **childs** [optional] : element childs. can contain strings an html elements.
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **nameSpace** [optional] : element namesapace if any.
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `HTMLElement` : a new html element

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.model"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.model


 Add a custom element to _dom.<br/> NB: the **__dom** property will be added to the element, pointing to it's interface (model instance).<br/> interface['dom'] : dom element;<br/> interface[tagName] : element tagName;


`_dom.model(tagName,constructor,cssRules,shadowed)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **tagName** : the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `function` **constructor** : receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor Must be a function and NOT a lambda expression because it is scoped to its interface.
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `object|function` **cssRules** [optional] : is or returns an object describing rules like _dom.rules,<br/>but the created collection will be insancied only once and shared among interfaces.<br/>Adds the 'rules' property to the interface.
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `boolean` **shadowed** [optional] : If true, your model is instanciable via html. See _dom.modelShadow.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.has"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.has


Checks if a model have been declared.


`_dom.has(tagName)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **tagName** : : the name of the model
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `boolean` : true if tagName exists.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.instance"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.instance


 Instanciates a declared model.<br/> Useful if you dont want of the **__dom** property in your html element.<br/> If not, you should instead use _dom and refer to the result **__dom** attribute.


`_dom.instance(tagName,___)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **tagName**
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `...` **___** : whatever arguments the model constructor uses
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `ModelInstance` : an object with the 'dom' property as the root HTMLElement.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.sheet"></a> ![](https://via.placeholder.com/15/0089E0/000000?text=+) _dom.sheet





Property
+ ![](https://via.placeholder.com/15/0089E0/000000?text=+) `CSSStyleSheet` **_dom.sheet** : The last available CSSStyleSheet.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.rule"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.rule


 Create a new js cssRule object;


`_dom.rule(selector,datas)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **selector** : the new rule css query.
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `object` **datas** [optional] : style datas.
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `CSSStyleRule`

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.rules"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.rules


 Create a collection of cssRule objects;


`_dom.rules(datas)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `object` **datas** : sass like structured object
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `object([ruleName]:CSSStyleRule)`

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.getRulesData"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.getRulesData


 Transform sass like data to css like data.


`_dom.getRulesData(datas)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `object` **datas** : sass like structured object
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `object(rules:object,alias:object)` : data with css rules and aliases.

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.modelShadowed"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.modelShadowed


check if a model has allready been shadowed.


`_dom.modelShadowed(tagName)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **tagName** : the model name.
+ ![](https://via.placeholder.com/15/ee9900/000000?text=+) **return**<br/> `boolean`

[▲](#main_menu)

<hr/>

#### <a name="tgt__dom.modelShadow"></a> ![](https://via.placeholder.com/15/6600ee/000000?text=+) _dom.modelShadow


renders your model intanciable via html by using dom shadow


`_dom.modelShadow(tagName)`
+ ![](https://via.placeholder.com/15/158900/000000?text=+) `string` **tagName** : the model name.

[▲](#main_menu)

<hr/>

### <a name='main_legends'></a> Legends

![](https://via.placeholder.com/15/ff0000/000000?text=+) : constructor<br/>![](https://via.placeholder.com/15/6600ee/000000?text=+) : method<br/>![](https://via.placeholder.com/15/158900/000000?text=+) : parameter<br/>![](https://via.placeholder.com/15/ee9900/000000?text=+) : return<br/>![](https://via.placeholder.com/15/0089E0/000000?text=+) : property