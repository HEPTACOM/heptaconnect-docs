{ pkgs, ... }:

{
  languages.python.enable = true;
  languages.python.version = "3.11";
  languages.python.venv.enable = true;
}
