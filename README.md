# ComTab
The name of this project is meaning `combine tab`.  It makes you easy to create panels that can 
combine or split like PhotoShop.

# Dependence
JQuery and JQuery.ui

# Quick Start
```js
import comtab, { ComtabPanelOptions } from './lib/comtab';

const stage = comtab({
  stage: '#stage',
  groups: [
    {
      position: {left: 200, top: 200},
      matrix: [
        [
          {
            tabs: [
              genTab(7, true),
              genTab(8)
            ]
          },
          {
            tabs: [
              genTab(10, true)
            ]
          }
        ],
        [
          {
            tabs: [
              genTab(9, true)
            ]
          }
        ]
      ]
    }
  ],
  panels: [
    genPanel([1, 2]),
    genPanel([3, 4, 5, 6], {
      position: {
        left: 400,
        top: 0
      }
    }, 3)
  ]
});

function genPanel (tabns: Array<number>, opts?: ComtabPanelOptions, activedn = 0) {
  const tabs = tabns.map((t, i) => genTab(t, i === activedn));
  return {
    tabs,
    ...opts
  }
}

function genTab (n: number, actived = false) {
  return {
    btnText: 'btn' + n,
    content: `<p>content${n}</p>`,
    actived
  }
}
```