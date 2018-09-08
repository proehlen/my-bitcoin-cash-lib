# TinyCash Bitcoin Cash Library

**IMPORTANT NOTICE!!!!**: Do **not** use this code!  It is neither safe nor tested for production use.

## History

I started writing this as the existing Bitcoin JavaScript libraries are quite large and involve learning the library quirks/api on top of learning bitcoin itself.  So, I began writing this library as a learning exercise, going back (as much as I can) to basics.  Obviously, for developing production apps you should use libraries that are safe, tested and have many eyes watching for problems (ie popular).

## Principles

* Avoid use of external libraries where practical.
* Use standard nodejs modules where they exist.
* Where external libraries are required (e.g. SECP256K1), favor JavaScript implementations over those requiring binary builds.

