import mkdocs_gen_files
from os import walk
from os import listdir
from os.path import isfile, join
import yaml
from yaml.loader import SafeLoader

docPath = 'docs'
onlyfiles = [f for f in listdir(docPath) if isfile(join(docPath, f))]

for root, _, files in walk(docPath):
    for item in files:
        if item.endswith(".md"):
            fullPath = join(root, item)[len(docPath)+1:]

            with mkdocs_gen_files.open(fullPath, "r") as alteredFile:
                oldContent = alteredFile.read()

            preface = dict()
            newContentParts = oldContent.split('---', 3)

            if len(newContentParts) == 3:
                preface = list(yaml.load_all(newContentParts[1], Loader=SafeLoader))[0]
            else:
                newContentParts = ['','', newContentParts[0]]

            if fullPath.startswith('guides/'):
                preface['role'] = fullPath.split('/')[1]
            elif fullPath.startswith('reference/'):
                preface['role'] = fullPath.split('/')[1]
            else:
                preface['role'] = fullPath.split('/')[0]

            newContentParts[1] = yaml.dump(preface)

            with mkdocs_gen_files.open(fullPath, "w") as alteredFile:
                print('---\n'.join(newContentParts), file=alteredFile)
