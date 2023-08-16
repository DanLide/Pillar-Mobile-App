import argparse
import dropbox
import os

ipa_file = "build/RepairStack.ipa"
manifest_file = "src/default_manifest.plist"
output_manifest_file = "build/manifest.plist"
dp_path = "https://dl.dropboxusercontent.com/s"
dp_builds_folder = "builds"

# PARSE args
parser=argparse.ArgumentParser()
parser.add_argument('--v', metavar='BUILD_VERSION', type=str, help='The version of the build.')
parser.add_argument('--t', metavar='DROP_BOX_TOKEN', type=str, help='Drop box token.')
parser.add_argument('--n', metavar='IPA_FILENAME', type=str, help='Name of generated ipa file.')

args = parser.parse_args()
build_version = args.v
dp_access_token = args.t
n_arg = args.n
ipa_filename = f"build/{n_arg}.ipa"

# RENAME IPA
os.rename(ipa_filename, ipa_file)


dp_client = dropbox.Dropbox(dp_access_token)
# UPLOAD IPA
with open(ipa_file, "rb") as f:
    ipa_file_data = f.read()

dp_ipa_path = f"/{dp_builds_folder}/{build_version}/RepairStack.ipa"
res = dp_client.files_upload(ipa_file_data, dp_ipa_path)

# GET IPA shared link
shared_link_metadata = dp_client.sharing_create_shared_link_with_settings(dp_ipa_path)
parts = shared_link_metadata.url.split('/')
folder = parts[-2]

dp_ipa_full_path = f"{dp_path}/{folder}/RepairStack.ipa"

# PREPARE MANIFEST
# open the input file in read mode
with open(manifest_file, "r") as f:
    manifest_data = f.read()

updated_manifest_data = manifest_data.replace("{IPA_URL}", dp_ipa_full_path)
with open(output_manifest_file, "w") as f:
    f.write(updated_manifest_data)

# UPLOAD MANIFEST
with open(output_manifest_file, "rb") as f:
    output_manifest_data = f.read()

dp_manifest_path = f"/{dp_builds_folder}/{build_version}/manifest.plist"
res = dp_client.files_upload(output_manifest_data, dp_manifest_path)

#FORM DOWNLOAD LINK
shared_link_metadata = dp_client.sharing_create_shared_link_with_settings(dp_manifest_path)
parts = shared_link_metadata.url.split('/')
folder = parts[-2]

dp_manifest_full_path = f"itms-services://?action=download-manifest&url={dp_path}/{folder}/manifest.plist"
print(f"Completed: {dp_manifest_full_path}")
