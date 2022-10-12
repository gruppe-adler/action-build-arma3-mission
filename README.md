# action-build-arma3-mission

This action builds your Arma 3 mission to a PBO. You could then use that and attach it as an artifact or to a release.

## Inputs
### `path`
This input is optional (Default: current directory = `.`)  
Relative path to mission directory.

### `pack_only`
This input is optional (Default: `false`)  
Only pack into a PBO without any binarization or rapification.

### `armake_verbose`
This input is optional (Default: `false`)  
Armake option `--verbose`. _Enable verbose output._

### `armake_force`
This input is optional (Default: `true`)  
Armake option `--force`. _Overwrite the target file/folder if it already exists._

### `armake_signature`
This input is optional (Default: none)  
Armake option `--signature`. _Signature path to use when signing the PBO._

### `armake_header_exts`
This input is optional (Default: none)  
Armake option `--headerext`. _Extension to add to PBO header._

### `armake_private_key`
This input is optional (Default: none)  
Armake option `--key`. _Sign the PBO with the given private key._

## Outputs

### `pbo_path`
Relative path of built PBO.

### `pbo_name`
Name of built PBO.

## Example usage

### Minimal example
```yaml
name: 'CI'

on:
  push:

jobs:
  build-mission:
    name: 'Build Arma 3 Mission'
    runs-on: ubuntu-latest # or windows-latest
    steps:
    - uses: actions/checkout@master

    - uses: gruppe-adler/action-build-arma3-mission@v1-beta
      id: build

    - uses: actions/upload-artifact@master
      with:
        name: ${{ steps.build.outputs.pbo_name }}
        path: ${{ steps.build.outputs.pbo_path }}
```

### Example with all options
```yaml
# [...]

    - uses: gruppe-adler/action-build-arma3-mission@v1-beta
      with:
        path: './path/to/my/mission/directory'
        pack_only: false
        armake_verbose: true
        armake_force: false
        armake_signature: './path/to/my/signature.bisign'
        armake_private_key: './path/to/my/private_key.bikey'
        armake_header_exts:
          header1: value1
          header2: value2
          header3: value3

# [...]
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)

## Contributing
You can run everything (`test`, `lint`, `build` & `package`) with `npm run all`.  
Make sure commit the `./dist` directory!!