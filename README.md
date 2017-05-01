# tnsg
**A NativeScript CLI Generator**

----------

Generate quickly your pages, services, class..

## Installation
```bash
npm install -g tnsg
```
## Generating Pages, Service, Class

Scaffold  | Usage
---       | ---
`Page` | `tnsg -p my-page`
`Service` | `tnsg -s my-service`
`Class` | `tnsg -c my-class` prompt will ask you if you want generate the associated service and page.

### Examples:
`tnsg -p page` will generate:
 - page.android.css
 - page.ios.css
 - page-common.css
 - page.component.ts
 - page.html
 and link the component in *app.module.ts*
