
  >Bugs
  >>'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.

  ``` javascript
  import * as React from 'react';//虽然没有直接使用到React 但是添加这行可以去除上诉报错信息。
  ```

  