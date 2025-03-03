# Tokens Faction

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-token-factions/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftoken-factions&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=token-factions)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-token-factions%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-token-factions%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ftoken-factions%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/token-factions/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-token-factions/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/token-factions/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/token-factions/)

### If you want to buy me a coffee [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/p4535992)


This module will allow you to assign tokens to factions by using the token's disposition colors, the token actor's folder color, or defining your own custom replacement colors for token dispositions.

![alt text](./wiki/module-on.png?raw=true)

Artwork and assets kindly provided by and used with permission of Caeora. [www.caeora.com](http://www.caeora.com)

**This is a keeping up to date of the idea of [Voldemalort](https://github.com/Voldemalort) and is project [Token Factions (original)](https://github.com/Voldemalort/token-factions) wishing him all the best possible**

## NOTE: This module is under maintenance, I have no plans to update or add features. However, I will try to fix any bugs as possible. Any contribution is welcome.

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-token-factions/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Configuration

![alt text](./wiki/default-settings.png?raw=true)

### Generate Token Faction Color From

- A Token's Disposition
- An Actor's Folder Color
- A Custom Color Set For Token Disposition

#### Default: A Token's Disposition

This option uses the default Token Disposition color to render the token base and frame. Token Disposition can be seen on a token's Character tab. Tokens with actors controlled by players are colored in a fourth, distinct color.

![alt text](./wiki/token-disposition.png?raw=true)

#### An Actor's Folder Color

This option uses the color of the folder a token's actor belongs in. A color of **#000000**, or the default color of a new actor folder, is treated as if there is no folder that will prevent a base and frame from being rendered for contained actor tokens.

![alt text](./wiki/actor-folder-color.png?raw=true)

#### [ON DEVELOPING] A Custom Color Set For Token Disposition

This option reveals additional configuration options allowing you to customize colors associated with each token disposition.

![alt text](./wiki/custom-settings.png?raw=true)

### Choose shape of your faction

Token frames (rings, square, hex) are layered above token graphics.

![img1](./wiki/border_faction_feature.png)

![img2](./wiki/border_faction_feature_round.png)

![img3](./wiki/border_faction_feature_fill_square.png)

![img4](./wiki/border_faction_feature_fill_round.png)

![alt text](./wiki/draw-token-frame.png?raw=true)

You can override this setting on a per-token basis on a token's Image tab if you use a mix of round and irregular tokens.

![alt text](./wiki/token-frame-override.png?raw=true)

### Frame Render Style

#### [FOR NOW IS THE ONLY AVAIABLE OPTION] Default: Flat

This option renders the frame in a flat color.

![alt text](./wiki/flat-frame-style.png?raw=true)

#### [ON DEVELOPING] Beveled

This option renders the frame in a beveled style typically seen surrounding round tokens.

![alt text](./wiki/beveled-frame-style.png?raw=true)

### Frame/Border Width (Percent of Grid Unit)

This allows you to change the thickness of the rendered frame. The percentage is based on the width of a single grid unit, not the token width, so larger and smaller tokens will have a consistent frame size.

![alt text](./wiki/token-sizes.png?raw=true)

### Base Opacity

Setting this value to anything lower than 1 will allow the map background to be seen through the base. Setting this value to 0 will disable drawing the base entirely.

### Frame Opacity

Setting this value to anything lower than 1 will allow the map background or token to be seen through the frame. Setting this value to 0 will disable drawing the frame entirely.

### Enable/Disable the faction on the single token on the canvas

- Left click: You can enable/disable the faction style for single token with a new hud button
- Right click: Open a dialog for customize the border color

![img7](./wiki/custom-picker-color-token.gif)

# API


### game.modules.get('token-factions').api.retrieveBorderFactionsColorFromToken(tokenIdOrName:string) ⇒ <code>string</code>

A method to retrieve the string color hex border of a token on the canvas founded by id or name

**Returns**: <code>string</code>

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenIdOrName | <code>string</code> | The oken id or name (if founded) | <code>#000000</code> |

### async game.modules.get('token-factions').api.disableDrawBorderFactionsFromTokens(tokenIdsOrNames:string[]) ⇒ <code>Promise&lt;void&gt;</code>

A method to disable the draw border factions on a array of tokens on the canvas founded by id or name

**Returns**: <code>Promise&lt;void&gt;</code>

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenIdsOrNames | <code>string[]</code> | The array of token ids or names (if founded) | <code>undefined</code> |

### async game.modules.get('token-factions').api.disableDrawBorderFactionsFromToken(tokenIdOrName:string) ⇒ <code>Promise&lt;void&gt;</code>


A method to disable the draw border factions on a token founded by id or name

**Returns**: <code>Promise&lt;void&gt;</code>

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenIdOrName | <code>string</code> | The token id or name (if founded) | <code>undefined</code> |


### async game.modules.get('token-factions').api.enableDrawBorderFactionsFromTokens(tokenIdsOrNames:string[]) ⇒ <code>Promise&lt;void&gt;</code>

A method to enable the draw border factions on a array of tokens on the canvas founded by id or name

**Returns**: <code>Promise&lt;void&gt;</code>

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenIdsOrNames | <code>string[]</code> | The array of token ids or names (if founded) | <code>undefined</code> |


### async game.modules.get('token-factions').api.enableDrawBorderFactionsFromToken(tokenIdOrName:string) ⇒ <code>Promise&lt;void&gt;</code>


A method to enable the draw border factions on a token founded by id or name

**Returns**: <code>Promise&lt;void&gt;</code>

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenIdOrName | <code>string</code> | The token id or name (if founded) | <code>undefined</code> |

# Build

## Install all packages

```bash
npm install
```
## npm build scripts

# Build

## Install all packages

```bash
npm install
```

### dev

`dev` will let you develop you own code with hot reloading on the browser

```bash
npm run dev
```

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build:watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### lint

`lint` launch the eslint process based on the configuration [here](./.eslintrc.json)

```bash
npm run-script lint
```

### lint:fix

`lint:fix` launch the eslint process with the fix argument

```bash
npm run-script lint:fix
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-token-factions/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- **[injectConfig](https://github.com/theripper93/injectConfig)**: [MIT](https://github.com/theripper93/injectConfig/blob/main/LICENSE)
- **[Border-Control](https://github.com/kandashi/Border-Control)**: [MIT](https://github.com/kandashi/Border-Control/blob/master/LICENSE)

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [Token Factions (original)](https://github.com/Voldemalort/token-factions) ty to [Voldemalort](https://github.com/Voldemalort)
- [Token Factions (fork)](https://github.com/erithtotl/token-factions) ty to [erithtotl](https://github.com/erithtotl)
- [Border-Control](https://github.com/kandashi/Border-Control) ty to [kandashi](https://github.com/kandashi)
- Ty to [theripper93](https://github.com/theripper93) for the module [injectConfig](https://github.com/theripper93/injectConfig)
