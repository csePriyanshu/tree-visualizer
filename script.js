class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1; // For AVL tree height
    }
} 

class BinaryTree {
    constructor() {
        this.root = null;
    }

    _contains(node, value) {
        if (node === null) return false;
        if (node.value === value) return true;
        return this._contains(node.left, value) || this._contains(node.right, value);
    }

    // Binary Tree insertion: Arbitrarily insert nodes level by level (no ordering rules)
    insert(value) {
        if (this.root === null) {
            this.root = new TreeNode(value);
            return;
        }

        // Check for duplicate values
        if (this._contains(this.root, value)) {
            return;  // If the value already exists, do nothing
        }

        const newNode = new TreeNode(value);
        const queue = [this.root];

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (currentNode.left === null) {
                currentNode.left = newNode;
                break;
            } else {
                queue.push(currentNode.left);
            }

            if (currentNode.right === null) {
                currentNode.right = newNode;
                break;
            } else {
                queue.push(currentNode.right);
            }
        }
    }

    delete(value) {
        this.root = this._deleteRec(this.root, value);
    }

    _deleteRec(node, value) {
        if (node === null) return node;
        if (value < node.value) node.left = this._deleteRec(node.left, value);
        else if (value > node.value) node.right = this._deleteRec(node.right, value);
        else {
            if (node.left === null) return node.right;
            else if (node.right === null) return node.left;
            node.value = this._minValue(node.right);
            node.right = this._deleteRec(node.right, node.value);
        }
        return node;
    }

    inorderTraversal(node, callback) {
        if (node !== null) {
            this.inorderTraversal(node.left, callback);
            callback(node);
            this.inorderTraversal(node.right, callback);
        }
    }

    preorderTraversal(node, callback) {
        if (node !== null) {
            callback(node);
            this.preorderTraversal(node.left, callback);
            this.preorderTraversal(node.right, callback);
        }
    }

    postorderTraversal(node, callback) {
        if (node !== null) {
            this.postorderTraversal(node.left, callback);
            this.postorderTraversal(node.right, callback);
            callback(node);
        }
    }

    levelOrderTraversal(callback) {
        const queue = [];
        if (this.root !== null) queue.push(this.root);
        while (queue.length > 0) {
            const node = queue.shift();
            callback(node);
            if (node.left !== null) queue.push(node.left);
            if (node.right !== null) queue.push(node.right);
        }
    }
}

class BinarySearchTree extends BinaryTree {
    _insertRec(node, value) {
        if (node === null) return new TreeNode(value);
        if (value < node.value) node.left = this._insertRec(node.left, value);
        else if (value > node.value) node.right = this._insertRec(node.right, value);
        return node;
    }

    // Overriding insert to follow BST rules (values inserted based on < or > comparison)
    insert(value) {
        this.root = this._insertRec(this.root, value);
    }

    _deleteRec(node, value) {
        if (!node) return node;

        if (value < node.value) node.left = this._deleteRec(node.left, value);
        else if (value > node.value) node.right = this._deleteRec(node.right, value);
        else {
            // Node to be deleted found
            if (!node.left) return node.right; // One child or no child case
            if (!node.right) return node.left;

            // Node with two children: Get the inorder successor
            const minValueNode = this._getMinValueNode(node.right);
            node.value = minValueNode.value;
            node.right = this._deleteRec(node.right, minValueNode.value); // Delete successor
        }
        return node;
    }

    _getMinValueNode(node) {
        let current = node;
        while (current.left) current = current.left;
        return current;
    }

    delete(value) {
        this.root = this._deleteRec(this.root, value);
    }
}

class AVLTree extends BinarySearchTree {
    _insertRec(node, value) {
        if (node === null) return new TreeNode(value);

        if (value < node.value) node.left = this._insertRec(node.left, value);
        else if (value > node.value) node.right = this._insertRec(node.right, value);
        else return node;  // No duplicates allowed

        node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));

        const balance = this._getBalance(node);

        // Left-Left Case
        if (balance > 1 && value < node.left.value) return this._rightRotate(node);

        // Right-Right Case
        if (balance < -1 && value > node.right.value) return this._leftRotate(node);

        // Left-Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = this._leftRotate(node.left);
            return this._rightRotate(node);
        }

        // Right-Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = this._rightRotate(node.right);
            return this._leftRotate(node);
        }

        return node;
    }

    _deleteRec(node, value) {
        if (!node) return node;

        if (value < node.value) node.left = this._deleteRec(node.left, value);
        else if (value > node.value) node.right = this._deleteRec(node.right, value);
        else {
            // Node to be deleted found
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            const minValueNode = this._getMinValueNode(node.right);
            node.value = minValueNode.value;
            node.right = this._deleteRec(node.right, minValueNode.value);
        }

        // Update height of the current node
        node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));

        // Balance the node after deletion
        const balance = this._getBalance(node);

        // Left-Left Case
        if (balance > 1 && this._getBalance(node.left) >= 0) return this._rightRotate(node);

        // Left-Right Case
        if (balance > 1 && this._getBalance(node.left) < 0) {
            node.left = this._leftRotate(node.left);
            return this._rightRotate(node);
        }

        // Right-Right Case
        if (balance < -1 && this._getBalance(node.right) <= 0) return this._leftRotate(node);

        // Right-Left Case
        if (balance < -1 && this._getBalance(node.right) > 0) {
            node.right = this._rightRotate(node.right);
            return this._leftRotate(node);
        }

        return node;
    }

    _getHeight(node) {
        return node ? node.height : 0;
    }

    _getBalance(node) {
        return node ? this._getHeight(node.left) - this._getHeight(node.right) : 0;
    }

    _leftRotate(z) {
        const y = z.right;
        const T2 = y.left;

        y.left = z;
        z.right = T2;

        z.height = 1 + Math.max(this._getHeight(z.left), this._getHeight(z.right));
        y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));

        return y;
    }

    _rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));
        x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));

        return x;
    }
}


function selectTreeType() {
    const treeType = document.getElementById('treeType').value;
    if (treeType === 'binary') {
        tree = new BinaryTree();
    } else if (treeType === 'bst') {
        tree = new BinarySearchTree();
    } else if (treeType === 'avl') {
        tree = new AVLTree();
    }
    visualizeTree(); // Re-render the tree when type changes
}

function insertNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (!isNaN(value)) {
        tree.insert(value);
        visualizeTree();
    }
}

function deleteNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (!isNaN(value)) {
        tree.delete(value);
        visualizeTree();
    }
}

function visualizeTree() {
    const treeContainer = document.getElementById('treeContainer');
    treeContainer.innerHTML = '';  // Clear existing tree visualization

    if (tree.root) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '600');
        svg.setAttribute('height', '400');

        // Recursively draw the tree
        drawNode(tree.root, svg, 300, 40, 150);

        treeContainer.appendChild(svg);
    }

    // Display traversal result container
    const traversalResultContainer = document.getElementById('traversalResult');
    traversalResultContainer.innerHTML = ''; // Clear previous traversal result
}

function drawNode(node, svg, x, y, offset) {
    if (!node) return;

    // Create circle and text for the node
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 20);
    circle.setAttribute('fill', '#1100FFFF');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('id', `node-${node.value}`);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5); // Adjust for text centering
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#fff');
    text.textContent = node.value;

    svg.appendChild(circle);
    svg.appendChild(text);

    if (node.left) {
        const leftX = x - offset;
        const leftY = y + 60;

        drawLine(svg, x, y, leftX, leftY); // Draw line to left child
        drawNode(node.left, svg, leftX, leftY, offset / 2); // Draw left child
    }

    if (node.right) {
        const rightX = x + offset;
        const rightY = y + 60;

        drawLine(svg, x, y, rightX, rightY); // Draw line to right child
        drawNode(node.right, svg, rightX, rightY, offset / 2); // Draw right child
    }
}

function drawLine(svg, x1, y1, x2, y2) {
    // Calculate the angle and adjust the line to start from the boundary of the circle
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const angle = Math.atan2(deltaY, deltaX);

    const r = 20; // Radius of the circle (node)
    const startX = x1 + r * Math.cos(angle);
    const startY = y1 + r * Math.sin(angle);

    const endX = x2 - r * Math.cos(angle);
    const endY = y2 - r * Math.sin(angle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', '#333');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
}

// Display traversal result function
function displayTraversalResult(traversalNodes) {
    const traversalResultContainer = document.getElementById('traversalResult');
    traversalResultContainer.innerHTML = '';

    const values = traversalNodes.map(node => node.value);
    traversalResultContainer.innerHTML = values.join(' -> ');
}

// visualizeTraversal function
function visualizeTraversal() {
    const traversalType = document.getElementById('traversal').value;
    const traversalNodes = [];
    
    // Disable the button to prevent pressing during animation
    const visualizeButton = document.getElementById('visualizeTraversalButton');
    visualizeButton.disabled = true;

    // Determine the traversal type and collect the nodes
    if (traversalType === 'inorder') {
        tree.inorderTraversal(tree.root, (node) => traversalNodes.push(node));
    } else if (traversalType === 'preorder') {
        tree.preorderTraversal(tree.root, (node) => traversalNodes.push(node));
    } else if (traversalType === 'postorder') {
        tree.postorderTraversal(tree.root, (node) => traversalNodes.push(node));
    } else if (traversalType === 'levelorder') {
        tree.levelOrderTraversal((node) => traversalNodes.push(node));
    }

    // Animate traversal and display results
    animateTraversal(traversalNodes, () => {
        // Re-enable the button once the traversal visualization is complete
        visualizeButton.disabled = false;
    });
    
    displayTraversalResult(traversalNodes);
}


function animateTraversal(traversalNodes, onComplete) {
    let index = 0;

    function highlightNode() {
        if (index > 0) {
            // Reset the color of the previous node
            document.getElementById(`node-${traversalNodes[index - 1].value}`).setAttribute('fill', '#1100FFFF');
        }
        if (index < traversalNodes.length) {
            // Highlight the current node
            const nodeId = `node-${traversalNodes[index].value}`;
            document.getElementById(nodeId).setAttribute('fill', '#FF1E00FF');
            index++;
        } else {
            clearInterval(intervalId); // Stop the animation when traversal is done
            if (onComplete) onComplete(); // Call the callback function after completion
        }
    }

    const intervalId = setInterval(highlightNode, 1000); // Adjust speed here (1 second per node)
}

// Initialize the default tree type
let tree = new BinaryTree();  // Default is Binary Tree
selectTreeType();
