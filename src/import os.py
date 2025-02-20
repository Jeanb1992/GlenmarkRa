import os
import json

def generate_assets_section(directory):
    result = []  # Lista para almacenar los nombres de los archivos

    # Recorre todos los archivos en el directorio
    for filename in os.listdir(directory):
        if filename.endswith('.gltf'):
            result.append(filename)

    # Ordenar los nombres alfabéticamente
    result.sort()

    # Generar la sección <a-assets>
    assets_section = "<a-assets>\n"
    for filename in result:
        assets_section += f'    <a-asset-item id="{filename.split(".")[0]}" src="./assets/3d/archivos gltf/{filename}"></a-asset-item>\n'
    assets_section += "</a-assets>"

    # Imprimir la sección generada
    print(assets_section)

# Cambia la ruta a la ruta absoluta de tu carpeta
generate_assets_section('C:\\Users\\Home\\Desktop\\Proyecto RA\\mindar-ar-project\\src\\assets\\3d\\archivos gltf')