import json
from operator import add
import pprint

class DataLoader:
    json_dict = None

    cols_key = 'columns'
    tree_key = 'rows'
    data_key = 'data'

    metadata_key = 'metadata'
    taxonomy_key = 'taxonomy'


    cols = None
    tree = None
    data = None

    def __init__(self, filename):
        self.json_dict = self.json_to_dict(filename)

        if self.has_key(self.cols_key):
            self.cols = self.json_dict[self.cols_key]

        if self.has_key(self.tree_key):
            self.tree = self.json_dict[self.tree_key]

        if self.has_key(self.data_key):
            self.data = self.json_dict[self.data_key]



    def has_key(self, key):
        if self.json_dict is not None and key in self.json_dict.keys():
            return True
        return False


    def json_to_dict(self, filename):
        json_dict = {}
        with open(filename, 'r') as json_file:
            json_str = json_file.read()
            json_dict = json.loads(json_str)
            print(type(json_dict))
        return json_dict

    def get_subtree(self, parent_entry, levels=1):
        subtree_list = []

        subtree_list.append(parent_entry)
        for entry in self.tree:
            if self.is_child(entry, parent_entry):
                subtree_list.append(entry)

        subtree_list.sort(key=lambda x: len(self.access_taxonomy(x)), reverse=False)

        return subtree_list

    def get_index(self, entry):
        for i in range(0, len(self.tree)):
            if entry is self.tree[i]:
                return i
        return -1

    def get_indices(self, entry_list):
        indices = []
        for i in range(0, len(self.tree)):
            entry = self.tree[i]

            if entry in entry_list:
                indices.append(i)

        return indices


    def get_leaves(self, entry):
        subtree_list = self.get_subtree(entry)

        leaf_entrys = []

        for i in range(len(subtree_list)-1, -1, -1):
            node = subtree_list[i]


            if len(self.get_subtree(node)) == 1:
                leaf_entrys.append(node)

        return leaf_entrys

    def to_js_dict(self, level=2):
        tree_dict = {}
        self.fill_subtree(tree_dict, self.tree, level)
        return tree_dict


    def fill_subtree(self, children_dict, subtree_list, level_counter):
        if level_counter == 0:
            return

        subtree_root = subtree_list[0]
        children_dict = self.fill_data_dict(children_dict, subtree_root)
        children_list = self.get_childs_of_tree(subtree_list)

        if len(subtree_list) == 1:
            return

        for child in children_list:
            child_subtree_list = self.get_subtree(child)

            for element in child_subtree_list:
                print(element)

            #input()

            #if len(child_subtree_list) == 1:
            #    return
            self.fill_subtree(children_dict, child_subtree_list, level_counter-1)


    def fill_data_dict(self, node_dict_entry, entry):
        path = self.access_taxonomy(entry)
        sum_data = self.get_data(entry)

        node_dict_entry[path[-1]] = {}

        child_node_dict = node_dict_entry[path[-1]]

        child_node_dict['path'] = path
        child_node_dict['read_count'] = sum_data
        child_node_dict['children'] = {}

        children = child_node_dict['children']
        return children;


    def test_function(self):
        #for entry in self.tree:
        #    print(self.access_taxonomy(entry))


        #entry = self.get_entry('Regulation and Cell signaling')
        entry = self.get_entry('d__Bacteria')

        child_entry = self.get_entry('g__Clostridium')


        #print(entry)
        #print(child_entry)

        #print(self.is_child(child_entry, entry))
        #print(self.is_child(entry, child_entry))

        children = self.get_childs_of_tree(self.get_subtree(child_entry))

        print("subtree################################################################################################")
        subtree_list = self.get_subtree(entry)



        #for entry in subtree_list:
        #    print(entry)

        subtree_childs = self.get_childs_of_tree(subtree_list)

        #for child in subtree_childs:
        #    print(child)

        indices = self.get_indices(subtree_childs)

        data_list = [self.data[i] for i in indices]

        #print("taxa data comparison")
        #for taxa, data in zip(subtree_childs, data_list):
        #    print(taxa)
        #    print(data)
        #    input()


        print("############# TEST GET LEAVES")
        print(entry)
        leaves = self.get_leaves(entry)

        for leaf in leaves:
            print(leaf)


        leaf_indices = self.get_indices(leaves)
        leaf_data = [self.data[i] for i in leaf_indices]

        print("TEST LEAF STUFF ETC#########################")
        #for taxa, data in zip(leaves, leaf_data):
        #    print(taxa)
        #    print(data)



        #print(self.get_data(entry))


        print(" TEST DICT YO ############################################### ")

        tree_dict = self.to_js_dict(level=500)

        pprint.pprint(tree_dict)



    def get_data(self, entry):
        subtree = self.get_subtree(entry)
        indices = self.get_indices(subtree)

        vector = None

        for index in indices:
            data = self.data[index]

            if vector == None:
                vector = data
            else:
                vector = map(add, vector, data)

        return list(vector)

    def is_leaf(self, entry):
        if len(self.get_subtree(entry)) == 1:
            return True
        return False

    def get_childs_of_tree(self, subtree_list):
        root_depth = len(self.access_taxonomy(subtree_list[0]))
        child_list = []
        for entry in subtree_list:
            entry_depth = len(self.access_taxonomy(entry))

            if entry_depth-1 == root_depth:
                child_list.append(entry)

        return child_list


    def access_taxonomy(self, entry):
        if self.metadata_key in entry.keys() and self.taxonomy_key in entry[self.metadata_key].keys():
            return entry[self.metadata_key][self.taxonomy_key]
        return None

    def is_child(self, taxa_entry, parent_entry):
        taxonomy = self.access_taxonomy(taxa_entry)
        parent_taxonomy = self.access_taxonomy(parent_entry)

        if len(taxonomy) <= len(parent_taxonomy):
            return False
        for i in range(0, len(parent_taxonomy)):
            if taxonomy[i] != parent_taxonomy[i]:
                return False
        return True

    def get_entry(self, node):
        for entry in self.tree:
            if self.access_taxonomy(entry)[-1] == node:
                return entry
        return None


if __name__ == '__main__':
    print("main")

    #dataloader = DataLoader("test.json")

    dataloader = DataLoader("taxa2.json")

    dataloader.test_function()


# json_dict = json_to_dict("test.json")
#
# cols = json_dict['columns']
#
# print (cols)
#
# rows = json_dict['rows']
# data = json_dict['data']
#
# print(len(rows))
# print(len(data))
#
# for r, d in zip(rows, data):
#     print(r)
#     print(d)
#     input()
#
#
#
# for key in json_dict.keys():
#     print (key)
#     print("###Show Key Value")
#     value = json_dict[key]
#     print("type: " + str(type(value)))
#
#     if key == 'data':
#         for ele in value:
#             print(ele)
#             input()
#
#
#     if type(value) == type(list()):
#         print("islist")
#         for item in value:
#             #print("item type: " + str(type(item)))
#             #print(item)
#
#             if type(item) == type ({}) and 'metadata' in item.keys():
#                 if type(item['metadata']) == type({}) and 'taxonomy' in item['metadata'].keys():
#                     if len(item['metadata']['taxonomy']) < 3:
#                         print (item)
#
#
#
#     else:
#         print(value)
#
#
#
#     print("###########################################################################################################")
#     input()
