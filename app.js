/**
 * PaginationTable
 * @param {array} [collection] [list of items to shown in the table]
 * @param {array} [columns] [properties of the columns, the dislay value, key value and whether the column is image]
 * @param {number} [rowsOnePage] [number of rows shown on one page]
 * @param {object} [$container] [jQuery container element, where the table will be appended to]
 */

var PaginationTable = function(collection, columns, rowsOnePage, $container) {
	this.collection = collection;
	this.columns = columns || {};
	this.rowsOnePage = rowsOnePage;
	this.pageId = 0;
	this.$container = $container;

	this.groupedCollection = this._groupCollection();
};


/**
 * [_groupCollection Group the collection into groups depending on the number for each group]
 * @return {[array]} [the result after grouping]
 */
PaginationTable.prototype._groupCollection = function() {
	var groupedArray = [];
  
  for(var i=0; i<this.collection.length; i++) {
    if (i % this.rowsOnePage === 0) {
      groupedArray.push([]);     
    }     
    groupedArray[groupedArray.length-1].push(this.collection[i]);    
  }
  
  return groupedArray;
};


/**
 * [_constructTable Construct the table]
 * @return {[object]} [the table element after being constructed]
 */
PaginationTable.prototype._constructTable = function() {
	var template = '<table class="table table-bordered people-list-table"></table>';
  var $table = $(template); 

	this._constructHeader($table);
	this._constructRows($table);

	return $table;
};

/**
 * [_constructControls Construct the controls]
 * @return {[object]} [the controls element after being constructed]
 */
PaginationTable.prototype._constructControls = function() {
	var template = '<div class="controls"></div>';
	var $controls = $(template);

	var $leftControls = $('<span class="arrow btn" id="left-arrow"><</span>');
	var $rightControls = $('<span class="arrow btn" id="right-arrow">></span>');

	var $numberControls = this._constructNumberControls();

	$controls.append($leftControls);	
	$controls.append($numberControls);
	$controls.append($rightControls);
	return $controls;
};


PaginationTable.prototype._constructNumberControls = function(first_argument) {
	var template = '';
	var self = this;

	_.forEach(this.groupedCollection, function(group, i) {
		template += _.template('<span class="btn number-controls" data-id="<%= i %>"><%= i %></span>')({
				i: i 
			});
	});

	return $(template);
};

/**
 * [_constructHeader Construct the table header]
 */
PaginationTable.prototype._constructHeader = function($table) {
	var tableHeaders = '<tr class="table-header">';
	var headerNames = this.columns.map(function(col) {
		return col.name;
	});
  
  _.forEach(headerNames, function(h) {
    tableHeaders += '<th>' + h + '</th>';
  });
  
  tableHeaders += '</tr>';  
  $table.append($(tableHeaders));
};


/**
 * [_constructOneRow Construct one table row]
 * @param  {[object]} data [data to be displayed for the row]
 * @return {[object]}      [the table row that gets constructed]
 */
PaginationTable.prototype._constructOneRow= function(data) {
	var template = '<tr class="table-row">>';
  
  _.forEach(this.columns, function(col) {
  	if (col.isImage) {
  		template += '<td>' + '<image class="td-image" src=' + data[col.key] + '>' + '</td>';
  	} else {
  		template += '<td>' + data[col.key] + '</td>';
  	}
    
  });
  
  template += '</tr>';
  
  return $(template); 
};


/**
 * [_constructRows Construct all the rows for current page]
 */
PaginationTable.prototype._constructRows = function($table) {
	var data = this.groupedCollection[this.pageId];
	var self = this;

	_.forEach(data, function(d) {
		var $row = self._constructOneRow(d);
		$table.append($row);
	});
};


/**
 * [_clearRows Clear all the rows for current page]
 */
PaginationTable.prototype._clearRows = function() {
	this.$table.find('.table-row').remove();
};


PaginationTable.prototype._updateNumberControls = function() {
	var currentIndexControls = this.$controls.find('[data-id="'+ this.pageId + '"]');
	var otherControls = this.$controls.find('[data-id!="'+ this.pageId + '"]');
	$(currentIndexControls).addClass('btn-primary');
	$(otherControls).removeClass('btn-primary');

};

/**
 * [render To render the table inside the container]
 */
PaginationTable.prototype.render = function() {
	this.$table = this._constructTable();
	this.$controls = this._constructControls();

	this.$container.append(this.$table);
	this.$container.append(this.$controls);
	this._updateNumberControls();


  // bind events
	this.$leftControls = $(this.$controls.find('#left-arrow'));
	this.$rightControls = $(this.$controls.find('#right-arrow'));
	this.$numberControls = $(this.$controls.find('.number-controls'));

  var self = this;
	this.$leftControls.on('click', function() {
		self.movePrev();
	});

	this.$rightControls.on('click', function() {
		self.moveNext();
	});

	this.$numberControls.on('click', function() {
		self.pageId = $(this).attr('data-id');
		self._clearRows();
		self._constructRows(self.$table);
		self._updateNumberControls();
	});
};


/**
 * [moveNext Show the next page if applicable ]
 */
PaginationTable.prototype.moveNext = function() {
	if (this.pageId < this.groupedCollection.length - 1 ) {
		this.pageId ++;
		this._clearRows();
		this._constructRows(this.$table);
		this._updateNumberControls();
	} 	
};

/**
 * [movePrev Show the previous page if applicable]
 */
PaginationTable.prototype.movePrev = function() {
	if (this.pageId > 0) {
		this.pageId --;
		this._clearRows();
		this._constructRows(this.$table);
		this._updateNumberControls();
	} 
};

/*--------------------------------------------------------------*/ 

// JSON reponse
var response = {
  'people' : [
      {
        'imageUrl' : 'https://www.bankofenglandearlycareers.co.uk/media/2747/blank-profile.jpg',
        'username': 'john',
        'name': 'John',
        'description': 'Hi this is John',
        'id': '12345'
      },
      {
        'imageUrl' : 'http://www.huntsvillephotographicsociety.org/packages/photo_contest/blocks/member_gallery/images/profile.png',
        'username': 'jean',
        'name': 'Jean',
        'description': 'Hi this is Jean',
        'id': '12346'
      },
      {
        'imageUrl' : 'http://www.huntsvillephotographicsociety.org/packages/photo_contest/blocks/member_gallery/images/profile.png',
        'username': 'mary',
        'name': 'Mary',
        'description': 'Hi this is Mary',
        'id': '12347'
      },
      {
        'imageUrl' : 'https://www.bankofenglandearlycareers.co.uk/media/2747/blank-profile.jpg',
        'username': 'jerry',
        'name': 'Jerry',
        'description': 'Hi this is Jerry',
        'id': '12348'
      },
      {
        'imageUrl' : 'https://www.bankofenglandearlycareers.co.uk/media/2747/blank-profile.jpg',
        'username': 'tom',
        'name': 'Tom',
        'description': 'Hi this is Tom',
        'id': '12349'
      }  
  ]
};


var $container = $('.table-container');
var ROWS_ON_PAGE = 2;
var columns = [
  {
		name: 'Image Url',
		key: 'imageUrl',
		isImage: true
	},
  {
		name: 'Name',
		key: 'name'
	},
	{
		name: 'User Name',
		key: 'username'
	},	
	{
		name: 'ID',
		key: 'id'
	},
	{
		name: 'Description',
		key: 'description'
	}	
];


var myTable = new PaginationTable(response.people, columns, ROWS_ON_PAGE, $container);
myTable.render();



// style polish
// indicator
// sort function
// search function
