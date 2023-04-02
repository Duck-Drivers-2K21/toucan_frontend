import json
import boto3
from collections import defaultdict

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('toucan-dynamoDB2')

    # Define the partition key and sort key names
    partition_key = 'WebcamID'
    sort_key = 'TOD'

    # Perform the Scan operation
    response = table.scan()
    items = response['Items']

    # Group items by partition key and select the latest entry for each partition key
    latest_items = defaultdict(dict)
    for item in items:
        print(item)
        partition_key_value = item[partition_key]
        sort_key_value = item[sort_key]

        # Check if there is an existing item with the same partition key value
        if partition_key_value not in latest_items or latest_items[partition_key_value][sort_key] < sort_key_value:
            latest_items[partition_key_value] = item

    # Convert the latest_items dictionary to a list

    latest_items_list = list(latest_items.values())
    converted = []

    hardcoded_latlngs = {
        "36:8f:3b:e1:44:db": [-2.381645795282588, 51.377276174474474],
        "5f:4b:0e:01:5f:e4": [-2.3230542852726384, 51.37800502420777],
    }

    for item in latest_items_list:
        temp = item
        temp['TOD'] = float(item['TOD'])

        if temp['WebcamID'] in hardcoded_latlngs:
            temp['Location'] = hardcoded_latlngs[temp['WebcamID']]
        else:
            temp['Location'] = [-2.380201974283754, 51.37704846937747]

        converted.append(temp)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
'body': json.dumps(converted)
    }