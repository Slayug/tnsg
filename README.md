# tnsg
**A NativeScript CLI Generator**

----------

Generate quickly your pages, services, class..

## Installation
```bash
npm install -g tnsg
```
## Generating Pages, Service, Class (Angular)

Scaffold  | Usage
---       | ---
`Page` | `tnsg -p my-page`
`Service` | `tnsg -s my-service`
`Class` | `tnsg -c my-class`

### Examples:
`tnsg -p pages/login` will generate:
 - ./app/pages/login/login.android.css
 - ./app/pages/login/login.ios.css
 - ./app/pages/login/login-common.css
 - ./app/pages/login/login.component.ts
 - ./app/pages/login/login.html
 and link the component in *app.module.ts*

`tnsg -p pages/user-detail` will generate:
 - ./app/pages/user-detail/user-detail.android.css
 - ./app/pages/user-detail/user-detail.ios.css
 - ./app/pages/user-detail/user-detail-common.css
 - ./app/pages/user-detail/user-detail.component.ts
 - ./app/pages/user-detail/user-detail.html
 and link the component in *app.module.ts*

 ## Generating View {N}

 Scaffold  | Usage
 ---       | ---
 `View` | `tnsg -vi my-view`

### Examples:
`tnsg -vi views/user` will generate:
 - ./app/views/user/user.css
 - ./app/views/user/user.js
 - ./app/views/user/user.xml
