import comtab from './lib/comtab';

comtab({
  stage: '#stage',
  panels: [
    {
      tabs: [
        {
          btnText: 'btn1',
          content: '<p>content1</p>',
          actived: true
        },
        {
          btnText: 'btn2',
          content: '<p>content2</p>',
          actived: false
        }
      ]
    }
  ]
});