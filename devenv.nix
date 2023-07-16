{ pkgs, ... }:

{
  # Javascript for pre- and postcompilation steps
  languages.javascript.enable = true;
  languages.javascript.package = pkgs.nodejs-18_x;

  # Python for mkdocs
  languages.python.enable = true;
  languages.python.version = "3.11";
  languages.python.venv.enable = true;
}
