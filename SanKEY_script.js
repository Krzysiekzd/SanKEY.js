class PlotCreator {
  // 1. node_coordinates
  /**
   * Object containing the coordinates of a single node (used to specify single_link_data).
   * @typedef {Object} node_coordinates
   * @property {number} column - Index of the column.
   * @property {number} node - Index of a node in the specified column.
   */

  // 2. link_type
  /**
   * This property allows specifying shape of the link. It is a two-letter code with 4 possible variants.
   * First letter (L - left or R - right) specifies the side of a first node connected by this link.
   * Second letter specifies the side of a second connected node. If not precised, link_type is assumed to be
   * RL.
   * @typedef {('LR','RL','RR','LL')} link_type
   */

  // 3. single_sublink_data
  /**
   * Object containing full data about the sublink.
   * @typedef {Object} single_sublink_data
   * @property {number} value - Value of the sublink.
   * @property {number} shift - Vertical shift of the sublink. Value in the range [0,1) that specifies how much is
   *     the sublink shifted relatively to the main link, e.g. 0.5 means that the upper border of a sublink
   *     is exactly at 50% of the main link's height.
   * @property {string} [color] - Optional color of the sublink. Color defined here has the highest priority.
   */

  // 4. single_link_data
  /**
   * Object containing full data about the link.
   * @typedef {Object} single_link_data
   * @property {node_coordinates} from - First node coordinates.
   * @property {node_coordinates} to - Second node coordinates.
   * @property {number} value - Value of the link.
   * @property {link_type} [link_type='RL'] - Optional link type.
   * @property {string} [color] - Optional color of the link. Color defined here has the highest priority.
   * @property {single_sublink_data[]} [sublinks] - Optional array of the sublinks data.
   */

  /////// NODES DATA
  // 1. single_node_data
  /**
   * Object containing full data about the node.
   * @typedef {Object} single_node_data
   * @property {string} [label] - Node label.
   * @property {number} [width] - Optional node width as a ratio of a column width, e.g. 0.5 mean 50% of the column width.
   * @property {string} [color] - Optional color of the node. Color defined here has the highest priority.
   */
  /////// SETTINGS
  /**
   * Additional setting of the plot.
   * @typedef {Object} settings
   * @property {number} vertical_gap_between_nodes - Number between 0 and 1. Minimal size of the total vertical gap between nodes in a column (as a height fraction). E.g. *0.6* means that in each column at least 60% of its height will be the spacing between nodes. The default value is *0.7*.
   * @property {number} node_percent_of_column_width - Number between 0 and 1. Standard node width as a fraction of the column width. E.g. *0.6* means that each node will occupy 60% of the column width. The default value is *0.3*.
   * @property {boolean} show_column_lines - Boolean, determines whether to show the lines between columns. The default value is *true*.
   * @property {boolean} show_column_names - Boolean, determines whether to show the column names. The default value is *true*.
   * @property {boolean} show_links_out_of_range - Boolean, determines whether to show links in a situation where both nodes are not in the range of the plot, but the link between them is.
   *  If set to *true*, each time the plot is being refreshed, PlotCreator will look for such links, by scanning *k* nearest columns on each side of the column range,
   *  where *k* is the *length* of the longest link in the graph and *length* being defined as *|column_of_the_first_node - column_of_the_second_node|*.
   *  This may negatively impact the performance, however, unless there are links with the *length* around several thousand columns, the slowdown should not be noticeable. The default value is *true*.
   * @property {boolean} node_move_y - Boolean, determines whether the nodes can be moved vertically. The default value is *true*.
   * @property {boolean} linear_gradient_links - Boolean, determines whether the links should have a gradient color. The default value is *true*.
   * @property {string} plot_background_color - Any CSS color. Plot background color. The default value is *'#f5ecec'*.
   * @property {string} default_nodes_color - Any CSS color. Default nodes color. The default value is *'grey'*.
   * @property {string} default_links_color - Any CSS color. Default links color. The default value is *'blue'*.
   * @property {number} default_links_opacity - Number between 0 and 1. Default links opacity. The default value is *0.25*.
   * @property {number} default_gradient_links_opacity - Number between 0 and 1. Default opacity of links if those have a gradient color. The default value is *0.43*.
   * @property {string} default_sublinks_color - Any CSS color. Default sublinks color. The default value is *'red'*.
   * @property {number} default_sublinks_opacity - Number between 0 and 1. Default sublinks opacity. The default value is *0.8*.
   * @property {Object} label_colors_object - An object in which node labels are properties and node colors are the values. By defining such an object, the user can easily link node labels to their color, thus avoiding code redundancy. The default value is *{}*.
   * @property {string[]} column_names - An array of column names. If passed, then instead of column indexes, names from this array will be displayed. The default value is *undefined*.
   * @property {number} start_node_count_from - Number, determines from which number nodes in the columns are  being indexed. __Important: this will only impact the display and PlotCreator’s interface. While defining nodes and links data, the user still needs to use the standard array indexes.__ The default value is *0*.
   * @property {number} start_column_count_from - Number, determines from which number columns are being indexed. __Important: this will only impact the display and PlotCreator’s interface. While defining nodes and links data, the user still needs to use the standard array indexes.__ The default value is *0*.
   * @property {number} link_min_arc - Number, minimal curvature of the arc when the links have a curved shape, for example when a link connects the left sides of both nodes. The default value is *5*.
   * @property {number} link_arc_iterated_increase - Number, determines by how many pixels should increase the arc of the curved links when these are stacked. The default value is *5*.
   * @property {Object} lines_style_object - An object that defines styles of the lines between the columns. PlotCreator will recognize all properties that are also defined in the default object and only overwrite those defined by the user. The default values are: *{stroke: 'red', 'stroke-width': 2, 'stroke-opacity': 0.35, 'stroke-dasharray': '5,5'}*.
   * @property {Object} column_names_style_object - An object that defines styles of the column names. PlotCreator will recognize all properties that are also defined in the default object and only overwrite those defined by the user. The default values are: *{'font-size':'15px', color:'red', opacity:0.50,'font-weight':'bold'}*.
   * @property {CallableFunction} on_node_click_function - Function that will be executed after a node is clicked. PlotCreator will try to pass four arguments to it: *node_info*, *node_data_reference*, *node_element* and *event*.
   * @property {CallableFunction} on_link_click_function - Function that will be executed after a link is clicked. PlotCreator will try to pass four arguments to it: *link_info*, *link_data_reference*, *link_element* and *event*.
   * @property {CallableFunction} on_node_hover_function - Function that will be executed after a node is hovered. PlotCreator will try to pass four arguments to it: *node_info*, *node_data_reference*, *node_element* and *event*, same as in *on_node_click_function*. **Important: the return value of this function will be set as info bubble's inner HTML**.
   * @property {CallableFunction} on_link_hover_function - Function that will be executed after a link is hovered. PlotCreator will try to pass four arguments to it: *link_info*, *link_data_reference*, *link_element* and *event*, same as in *on_link_click_function*. **Important: the return value of this function will be set as info bubble's inner HTML**.
   * @property {string} hover_node_cursor - String, appearance of the cursor when a node is being hovered. The default value is *'pointer'*.
   * @property {string} hover_link_cursor - String, appearance of the cursor when a link is being hovered. The default value is *'help'*.
   * @property {string} grabbing_node_cursor - String, appearance of the cursor when a node is being grabbed. The default value is *'grabbing'*.
   *
   */
  /**
   * Main class to create and manage the Sankey Plot.
   * # SanKEY.js
   * (c) 2021 Krzysztof Zdąbłasz, GPL 3.0 License, https://github.com/Krzysiekzd/
   *
   * @param {HTMLElement} dom_container - DOM element in which the plot will be created. Creating a plot inside it may override some of its default styles. In particular, it will set the *overflow* to '*auto*'.
   * @param {single_node_data[][]} nodes_data - Nodes data.
   * @param {single_link_data[]} links_data - Links data.
   * @param {number} plot_width - Width of the plot in pixels.
   * @param {number} plot_height - Height of the plot in pixels.
   * @param {number} first_column - Index of first column to be shown.
   * @param {number} last_column - Index of first column that won't be shown.
   * @param {settings} settings - Object with additional plot settings.
   */
  #plot_width;
  #plot_height;
  #vertical_gap_between_nodes;
  #node_percent_of_column_width;
  #link_min_arc;
  #link_arc_iterated_increase;

  #first_column;
  #last_column;

  #show_column_lines;
  #show_column_names;
  #node_move_y;
  #linear_gradient_links;

  #show_links_out_of_range;
  #plot_background_color;
  #default_links_color;
  #default_nodes_color;
  #default_links_opacity;
  #default_gradient_links_opacity;
  #default_sublinks_color;
  #default_sublinks_opacity;
  #hover_node_cursor;
  #hover_link_cursor;
  #grabbing_node_cursor;

  #on_node_click_function;
  #on_link_click_function;
  #on_node_hover_function;
  #on_link_hover_function;

  #label_colors_object;

  lines_style_object;
  column_names_style_object;

  #column_names;
  #start_node_count_from;
  #start_column_count_from;
  nodes_data;
  links_data_structure;
  nodes_data_structure;

  #dom_container;
  #longest_link_length;
  #last_column_width;

  sankey_plot;
  constructor(
    dom_container,
    nodes_data,
    links_data,
    plot_width,
    plot_height,
    first_column,
    last_column,
    settings = {}
  ) {
    //  REQUIRED ARGUMENTS
    this.#dom_container = document.createElement("div");
    dom_container.appendChild(this.#dom_container);
    this.#dom_container.setAttribute("id", "sankey_plot_auto_container");
    this.#dom_container.style.overflow = "auto";
    this.#dom_container.classList.add("noselect");
    this.nodes_data = nodes_data;
    this.links_data_structure = links_data;
    this.#plot_width = plot_width;
    this.#plot_height = plot_height;
    this.#first_column = first_column;
    this.#last_column = last_column;
    //  OPTIONAL ARGUMENTS
    const default_settings = {
      vertical_gap_between_nodes: 0.7,
      node_percent_of_column_width: 0.3,
      show_column_lines: true,
      show_column_names: true,
      show_links_out_of_range: true,
      node_move_y: true,
      linear_gradient_links: true,
      link_min_arc: 5,
      link_arc_iterated_increase: 5,
      plot_background_color: "#f5ecec",
      default_links_color: "blue",
      default_nodes_color: "grey",
      default_links_opacity: 0.25,
      default_gradient_links_opacity: 0.43,
      default_sublinks_color: "red",
      default_sublinks_opacity: 0.8,
      label_colors_object: {},
      column_names: undefined,
      start_node_count_from: 0,
      start_column_count_from: 0,
      on_node_click_function: undefined,
      on_link_click_function: undefined,
      on_node_hover_function: (
        node_info,
        _node_data_reference,
        _node_element,
        _event
      ) => {
        return `${node_info["label"]}`;
      },
      on_link_hover_function: (
        link_info,
        _link_data_reference,
        _link_element,
        _event
      ) => {
        return `From: (column - ${link_info["from_column"]}, node - ${link_info["from_node"]}, label - "${link_info["from_label"]}") To: (column - ${link_info["to_column"]}, node - ${link_info["to_node"]}, label - "${link_info["to_label"]}") Value: ${link_info["value"]}`;
      },
      hover_node_cursor: "pointer",
      hover_link_cursor: "help",
      grabbing_node_cursor: "grabbing",
    };
    Object.assign(default_settings, settings);
    // define private fields
    this.#vertical_gap_between_nodes =
      default_settings.vertical_gap_between_nodes;
    this.#node_percent_of_column_width =
      default_settings.node_percent_of_column_width;
    this.#show_column_lines = default_settings.show_column_lines;
    this.#show_column_names = default_settings.show_column_names;
    this.#show_links_out_of_range = default_settings.show_links_out_of_range;
    this.#node_move_y = default_settings.node_move_y;
    this.#linear_gradient_links = default_settings.linear_gradient_links;
    this.#link_min_arc = default_settings.link_min_arc;
    this.#link_arc_iterated_increase =
      default_settings.link_arc_iterated_increase;
    this.#plot_background_color = default_settings.plot_background_color;
    this.#default_links_color = default_settings.default_links_color;
    this.#default_nodes_color = default_settings.default_nodes_color;
    this.#default_links_opacity = default_settings.default_links_opacity;
    this.#default_gradient_links_opacity =
      default_settings.default_gradient_links_opacity;
    this.#default_sublinks_color = default_settings.default_sublinks_color;
    this.#default_sublinks_opacity = default_settings.default_sublinks_opacity;
    this.#label_colors_object = default_settings.label_colors_object;
    this.#column_names = default_settings.column_names;
    this.#start_node_count_from = default_settings.start_node_count_from;
    this.#start_column_count_from = default_settings.start_column_count_from;
    this.#on_node_click_function = default_settings.on_node_click_function;
    this.#on_link_click_function = default_settings.on_link_click_function;
    this.#on_node_hover_function = default_settings.on_node_hover_function;
    this.#on_link_hover_function = default_settings.on_link_hover_function;
    this.#hover_node_cursor = default_settings.hover_node_cursor;
    this.#hover_link_cursor = default_settings.hover_link_cursor;
    this.#grabbing_node_cursor = default_settings.grabbing_node_cursor;

    //      Correcting parsed arguments, styles objects parsed separately
    this.#first_column -= this.#start_column_count_from;
    this.#last_column -= this.#start_column_count_from;

    // lines style definition
    this.lines_style_object = {
      stroke: "red",
      "stroke-width": 2,
      "stroke-opacity": 0.35,
      "stroke-dasharray": "5,5",
    };
    if (settings.hasOwnProperty("lines_style_object")) {
      Object.assign(this.lines_style_object, settings.lines_style_object); // writable
    }
    // column names style definition
    this.column_names_style_object = {
      "font-size": "15px",
      color: "red",
      opacity: 0.5,
      "font-weight": "bold",
    };
    if (settings.hasOwnProperty("column_names_style_object")) {
      Object.assign(
        this.column_names_style_object,
        settings["column_names_style_object"]
      ); // writable
    }

    //      END OF PARSING ARGUMENTS

    this.#longest_link_length = undefined;
    this.nodes_data_structure = [];
    this.#preprocessLinksData();
    this.#sortLinks();
    this.#prepareData();
    this.#last_column_width =
      this.#plot_width / (this.#last_column - this.#first_column); // width of column in last plot spawn, remembered to calculate shift or something, can't remember
    this.sankey_plot = this.#setNewPlot();
  }
  #sortLinks() {
    //sort by node order from
    this.links_data_structure.sort((a, b) => {
      return a["from"]["node"] - b["from"]["node"];
    });
    // sort by columns
    this.links_data_structure.sort((a, b) => {
      return a["from"]["column"] - b["from"]["column"];
    });
    // sort by node order to
    this.links_data_structure.sort((a, b) => {
      return a["to"]["node"] - b["to"]["node"];
    });
    // sort by link length
    this.links_data_structure.sort((a, b) => {
      return (
        a["to"]["column"] -
        a["from"]["column"] -
        (b["to"]["column"] - b["from"]["column"])
      );
    });
    // longest links are now last in the links_data_structure array
    const last_link =
      this.links_data_structure[this.links_data_structure.length - 1];
    this.#longest_link_length =
      last_link["to"]["column"] - last_link["from"]["column"];
  }
  #preprocessLinksData() {
    // change or add linktypes and orientation info
    for (const i in this.links_data_structure) {
      const link = this.links_data_structure[i];
      const from_column = link["from"]["column"];
      const to_column = link["to"]["column"];
      if (from_column === to_column) {
        if (link["from"]["node"] === link["to"]["node"]) {
          if (["LL", "RR"].includes(link["link_type"])) {
            throw new Error(
              "RR,LL LINKS CANNOT YET BE DEFINED BETWEEN THE SAME NODE"
            );
          } else if (
            link["link_type"] === undefined ||
            link["link_type"] === "LR" ||
            link["link_type"] === "RL"
          ) {
            link["link_type"] = "LR";
          } else {
            throw new Error(`"${link["link_type"]}" IS NOT A VALID LINK TYPE`);
          }
        } else {
          throw new Error(
            "LINKS CANNOT BE DEFINED BETWEEN NODES IN THE SAME COLUMN, UNLESS IT'S THE SAME NODE"
          );
        }
      } else if (from_column > to_column) {
        if (!link.hasOwnProperty("link_type")) {
          link["link_type"] = "LR";
          link["reversed"] = true;
          const _ = link["from"];
          link["from"] = link["to"];
          link["to"] = _;
        } else if (["LR", "RL", "LL", "RR"].includes(link["link_type"])) {
          //reverse link type
          link["link_type"] = link["link_type"][1] + link["link_type"][0];
          link["reversed"] = true;
          const _ = link["from"];
          link["from"] = link["to"];
          link["to"] = _;
        } else {
          throw new Error(`"${link["link_type"]}" IS NOT A VALID LINK TYPE`);
        }
      }
    }
  }
  #prepareData() {
    //////////////////////////////////////////////////////////////////////////////////////// NODE_DATA_STRUCTURE CREATE
    for (const i in this.nodes_data) {
      const column = [];
      for (const j in this.nodes_data[i]) {
        column.push({
          properties_object: this.nodes_data[i][j],
          height: 0,
          y: 0,
          horizontal_shift: 0,
          vertical_shift: 0,
          left_side_sum: 0,
          right_side_sum: 0,
          links_references: [],
        });
      }
      this.nodes_data_structure.push(column);
    }
    //////////////////////////////////////////////////////////////////////////////////////// NODE_DATA_STRUCTURE FILL + checking for sublinks
    for (const i in this.links_data_structure) {
      const link = this.links_data_structure[i];

      this.nodes_data_structure[link["from"]["column"]][link["from"]["node"]][
        "links_references"
      ].push({
        link_id: i,
        second_node_column: link["to"]["column"],
        second_node_position: link["to"]["node"],
      });
      // In case if the link connects the same node, we don't want to add it to the same 'links references' twice - it would cause bugs. That's why this if is here.
      if (
        !(
          link["to"]["column"] === link["from"]["column"] &&
          link["to"]["node"] === link["from"]["node"]
        )
      ) {
        this.nodes_data_structure[link["to"]["column"]][link["to"]["node"]][
          "links_references"
        ].push({
          link_id: i,
          second_node_column: link["from"]["column"],
          second_node_position: link["from"]["node"],
        });
      }
      switch (link["link_type"]) {
        case "LL":
          this.nodes_data_structure[link["from"]["column"]][
            link["from"]["node"]
          ]["left_side_sum"] += link["value"];
          this.nodes_data_structure[link["to"]["column"]][link["to"]["node"]][
            "left_side_sum"
          ] += link["value"];
          break;
        case "LR":
          this.nodes_data_structure[link["from"]["column"]][
            link["from"]["node"]
          ]["left_side_sum"] += link["value"];
          this.nodes_data_structure[link["to"]["column"]][link["to"]["node"]][
            "right_side_sum"
          ] += link["value"];
          break;
        case "RR":
          this.nodes_data_structure[link["from"]["column"]][
            link["from"]["node"]
          ]["right_side_sum"] += link["value"];
          this.nodes_data_structure[link["to"]["column"]][link["to"]["node"]][
            "right_side_sum"
          ] += link["value"];
          break;
        case "RL":
        case undefined:
          this.nodes_data_structure[link["from"]["column"]][
            link["from"]["node"]
          ]["right_side_sum"] += link["value"];
          this.nodes_data_structure[link["to"]["column"]][link["to"]["node"]][
            "left_side_sum"
          ] += link["value"];
          break;
        default:
          throw new Error(`${link["link_type"]} IS NOT A VALID LINK TYPE`);
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////// NODE_HEIGHT_UNIT AND SETTING (RELATIVE) NODES HIGHT

    let max = 0;
    const col_sums = [];
    for (const i in this.nodes_data_structure) {
      let current_column_sum = 0;
      for (const j in this.nodes_data_structure[i]) {
        const node = this.nodes_data_structure[i][j];
        let height = 0;
        node["right_side_sum"] > node["left_side_sum"]
          ? (height = node["right_side_sum"])
          : (height = node["left_side_sum"]);
        node["height"] = height;
        if (height > max) {
          max = height;
        }
        current_column_sum += height;
      }
      col_sums.push(current_column_sum);
    }
    const max_column_sum = Math.max.apply(null, col_sums);
    this.node_height_unit =
      ((1 - this.#vertical_gap_between_nodes) * this.#plot_height) /
      max_column_sum;

    //////////////////////////////////////////////////////////////////////////////////////// SETTING (EXACT) NODES Y COORD AND (EXACT) NODES HEIGHT
    for (const i in this.nodes_data_structure) {
      const gaps = this.nodes_data_structure[i].length + 1;
      const gap_height =
        ((this.#vertical_gap_between_nodes * this.#plot_height) /
          this.node_height_unit +
          (max_column_sum - col_sums[i])) /
        gaps;
      let height_used = gap_height;
      for (const j in this.nodes_data_structure[i]) {
        const node = this.nodes_data_structure[i][j];
        node["y"] = height_used * this.node_height_unit;
        height_used += node["height"];
        node["height"] *= this.node_height_unit;
        height_used += gap_height;
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////// FILL POSITION DATA IN LINKS
    for (const column_index in this.nodes_data_structure) {
      for (const node_index in this.nodes_data_structure[column_index]) {
        const node = this.nodes_data_structure[column_index][node_index];
        const left_side_links_normal = [];
        const right_side_links_normal = [];
        const left_side_links_special = [];
        const right_side_links_special = [];
        for (const link_index in node["links_references"]) {
          const link =
            this.links_data_structure[
              node["links_references"][link_index]["link_id"]
            ];
          switch (link["link_type"]) {
            case "LL":
              if (
                node["links_references"][link_index]["second_node_column"] >
                column_index
              ) {
                left_side_links_special.push(link);
              } else {
                left_side_links_normal.push(link);
              }
              break;
            case "LR":
              if (
                node["links_references"][link_index]["second_node_column"] >
                column_index
              ) {
                left_side_links_special.push(link);
              } else if (
                node["links_references"][link_index]["second_node_column"] ==
                column_index
              ) {
                left_side_links_special.push(link);
                right_side_links_special.push(link);
              } else {
                right_side_links_special.push(link);
              }
              break;
            case "RR":
              if (
                node["links_references"][link_index]["second_node_column"] >
                column_index
              ) {
                right_side_links_normal.push(link);
              } else {
                right_side_links_special.push(link);
              }
              break;
            case "RL":
            case undefined:
              if (
                node["links_references"][link_index]["second_node_column"] >
                column_index
              ) {
                right_side_links_normal.push(link);
              } else {
                left_side_links_normal.push(link);
              }
              break;
            default:
              throw new Error(`${link["link_type"]} IS NOT A VALID LINK TYPE`);
          }
        }
        // after adding links to arrays

        let left_side_occupied_height = 0;
        for (const i in left_side_links_normal) {
          const link = left_side_links_normal[i];
          link["right_side_rel_to_node_height"] = left_side_occupied_height;
          left_side_occupied_height += link["value"] * this.node_height_unit;
        }
        let right_side_occupied_height = 0;
        for (const i in right_side_links_normal) {
          const link = right_side_links_normal[i];
          link["left_side_rel_to_node_height"] = right_side_occupied_height;
          right_side_occupied_height += link["value"] * this.node_height_unit;
        }

        // SPECIAL
        left_side_links_special.sort((a, b) => {
          return b["to"]["node"] - a["to"]["node"];
        }); // ;)
        left_side_links_special.sort((a, b) => {
          return b["to"]["column"] - a["to"]["column"];
        }); // ;)
        const node_height = node["height"];
        let left_side_curve =
          -this.#link_arc_iterated_increase + this.#link_min_arc;
        let left_side_occupied_height_special = 0;
        for (const i in left_side_links_special) {
          const special_link =
            left_side_links_special[left_side_links_special.length - 1 - i]; // reversed because of the arcs
          const link_height = special_link["value"] * this.node_height_unit;
          special_link["left_side_rel_to_node_height"] =
            node_height - left_side_occupied_height_special - link_height;
          left_side_occupied_height_special += link_height;
          special_link["left_side_curve"] =
            left_side_curve + this.#link_arc_iterated_increase;
          left_side_curve += link_height + this.#link_arc_iterated_increase;
        }
        right_side_links_special.sort((a, b) => {
          return b["from"]["node"] - a["from"]["node"];
        }); //?
        right_side_links_special.sort((a, b) => {
          return a["from"]["column"] - b["from"]["column"];
        }); //?
        let right_side_curve =
          -this.#link_arc_iterated_increase + this.#link_min_arc;
        let right_side_occupied_height_special = 0;
        for (const i in right_side_links_special) {
          const special_link =
            right_side_links_special[right_side_links_special.length - 1 - i]; // reversed because of the arcs
          const link_height = special_link["value"] * this.node_height_unit;
          special_link["right_side_rel_to_node_height"] =
            node_height - right_side_occupied_height_special - link_height;
          right_side_occupied_height_special += link_height;
          special_link["right_side_curve"] =
            right_side_curve + this.#link_arc_iterated_increase;
          right_side_curve += link_height + this.#link_arc_iterated_increase;
        }
      }
    }
  }
  #setNewPlot() {
    this.#dom_container.replaceChildren();
    return new SankeyPlot(
      this.#dom_container,
      this.nodes_data_structure,
      this.links_data_structure,
      this.#plot_width,
      this.#plot_height,
      this.#node_percent_of_column_width,
      this.#first_column,
      this.#last_column,
      this.node_height_unit,
      this.#longest_link_length,
      this.#last_column_width,
      this.#show_column_lines,
      this.#show_column_names,
      this.#node_move_y,
      this.#linear_gradient_links,
      this.#link_arc_iterated_increase,
      this.#label_colors_object,
      this.#plot_background_color,
      this.#default_links_color,
      this.#default_links_opacity,
      this.#default_gradient_links_opacity,
      this.#default_sublinks_color,
      this.#default_sublinks_opacity,
      this.lines_style_object,
      this.#column_names,
      this.column_names_style_object,
      this.#default_nodes_color,
      this.#start_node_count_from,
      this.#start_column_count_from,
      this.#show_links_out_of_range,
      this.#on_node_click_function,
      this.#on_link_click_function,
      this.#on_node_hover_function,
      this.#on_link_hover_function,
      this.#hover_node_cursor,
      this.#hover_link_cursor,
      this.#grabbing_node_cursor
    );
  }
  /**
   * Changes current column range. Refreshes the plot. *First_column* and *last_column* are column indexes. *Note, that if the default *start_column_count_from* was changed,
   * then the indexes here must be shifted accordingly.
   * @param {number} first_column - Index of first column to be shown.
   * @param {number} last_column - Index of first column that won't be shown.
   * @returns {boolean} - Boolean. True if column range was changed successfully.
   */
  changeColumnRange(first_column, last_column) {
    if (
      first_column < this.#start_column_count_from ||
      last_column >
        this.nodes_data_structure.length + this.#start_column_count_from ||
      first_column >= last_column
    ) {
      console.warn(
        `CANNOT CHANGE COLUMN RANGE TO (${first_column},${last_column}).`
      );
      return false;
    } else {
      this.#first_column = first_column - this.#start_column_count_from;
      this.#last_column = last_column - this.#start_column_count_from;
      this.reloadPlot();
      return true;
    }
  }
  /**
   * Plot refresh. Useful when the plot data is manually modified.
   */
  reloadPlot() {
    this.sankey_plot = undefined; //dont remove - may trigger garbage collector faster
    this.sankey_plot = this.#setNewPlot();
  }
  /**
   * Allows changing whether column names are being displayed. Refreshes the plot.
   * @param {boolean} boolean
   */
  columnNames(boolean) {
    this.#show_column_names = boolean;
    this.reloadPlot();
  }
  /**
   * Allows changing whether lines between columns are being displayed. Refreshes the plot.
   * @param {boolean} boolean
   */
  columnLines(boolean) {
    this.#show_column_lines = boolean;
    this.reloadPlot();
  }
  /**
   * Allows changing whether nodes can be moved vertically. Refreshes the plot.
   * @param {boolean} boolean
   */
  yMovement(boolean) {
    this.#node_move_y = boolean;
    this.reloadPlot();
  }
  /**
   * Allows changing whether links have a gradient color. Refreshes the plot
   * @param {boolean} boolean
   */
  linearGradient(boolean) {
    this.#linear_gradient_links = boolean;
    this.reloadPlot();
  }
  /**
   * Method that should be used when one wants to remove the plot from DOM and from the memory.
   * *Note, that all references pointing to that object should also be removed*.
   */
  removePlot() {
    this.sankey_plot.clearData();
    this.#dom_container.removeChild(this.sankey_plot.dom_node);
    this.sankey_plot = undefined;
    this.links_data_structure = undefined;
    this.nodes_data_structure = undefined;
    this.nodes_data = undefined;
    this.#dom_container.remove();
  }
  /**
   * Setter for "show_links_out_of_range" setting. Refreshes the plot.
   */
  /**
   * Setter for "show_links_out_of_range" setting. Refreshes the plot.
   */
  setShowLinksOutOfRange(boolean) {
    this.#show_links_out_of_range = boolean;
    this.reloadPlot();
  }
  /**
   * Setter for "label_colors_object" setting. Refreshes the plot.
   */
  setLabelColorsObject(object) {
    this.#label_colors_object = object;
    this.reloadPlot();
  }
  /**
   * Setter for "default_links_color" setting.
   */
  setDefaultNodesColor(color) {
    this.#default_nodes_color = color;
    this.reloadPlot();
  }
  /**
   * Setter for "default_links_color" setting. Refreshes the plot.
   */
  setDefaultSublinksColor(color) {
    this.#default_sublinks_color = color;
    this.reloadPlot();
  }
}

class SankeyPlot {
  constructor(
    dom_container,
    nodes_data,
    links_data,
    plot_width,
    plot_height,
    nodes_width_percent,
    first_column,
    last_column,
    node_height_unit,
    longest_link_length,
    last_column_width,
    show_column_lines = true,
    show_column_names = true,
    node_move_y = true,
    linear_gradient_links = true,
    link_arc_iterated_increase = 5,
    label_colors_object = {},
    plot_background_color = "#f5ecec",
    default_links_color = "blue",
    default_links_opacity = 0.25,
    default_gradient_links_opacity = 0.43,
    default_sublinks_color = "red",
    default_sublinks_opacity = 0.8,
    line_definition_object = {
      stroke: "red",
      "stroke-width": 2,
      "stroke-opacity": 0.35,
      "stroke-dasharray": "5,5",
    },
    column_names = undefined,
    column_names_style = {
      "font-size": "15px",
      color: "red",
      opacity: 0.5,
      "font-weight": "bold",
    },
    default_nodes_color = "grey",
    start_node_count_from = 0,
    start_column_count_from = 0,
    show_links_out_of_range = true,
    on_node_click_function = undefined,
    on_link_click_function = undefined,
    on_node_hover_function = undefined,
    on_link_hover_function = undefined,
    hover_node_cursor = "pointer",
    hover_link_cursor = "help",
    grabbing_node_cursor = "grabbing"
  ) {
    this.dom_container = dom_container;
    this.nodes_data_structure = nodes_data;
    this.links_data = links_data;
    this.plot_width = plot_width;
    this.plot_height = plot_height;
    this.nodes_width_percent = nodes_width_percent;
    this.first_column = first_column;
    this.last_column = last_column;
    this.selected_node = undefined;
    this.node_height_unit = node_height_unit;
    this.longest_link_length = longest_link_length;
    this.last_column_width = last_column_width;
    this.column_width =
      this.plot_width / (this.last_column - this.first_column);
    this.node_move_y = node_move_y;
    this.linear_gradient_links = linear_gradient_links;
    this.link_arc_iterated_increase = link_arc_iterated_increase;
    this.label_colors_object = label_colors_object;
    this.plot_background_color = plot_background_color;
    this.default_links_color = default_links_color;
    this.default_links_opacity = default_links_opacity;
    this.default_gradient_links_opacity = default_gradient_links_opacity;
    this.default_sublinks_color = default_sublinks_color;
    this.default_sublinks_opacity = default_sublinks_opacity;
    this.line_definition_object = line_definition_object;
    this.column_names = column_names;
    this.column_names_style = column_names_style;
    this.default_nodes_color = default_nodes_color;
    this.start_node_count_from = start_node_count_from;
    this.start_column_count_from = start_column_count_from;
    this.show_links_out_of_range = show_links_out_of_range;
    this.on_node_click_function = on_node_click_function;
    this.on_link_click_function = on_link_click_function;
    this.on_node_hover_function = on_node_hover_function;
    this.on_link_hover_function = on_link_hover_function;
    this.hover_node_cursor = hover_node_cursor;
    this.hover_link_cursor = hover_link_cursor;
    this.grabbing_node_cursor = grabbing_node_cursor;
    this.node_info_div = undefined;
    this.mouseovered_node = undefined;
    this.link_info_div = undefined;
    this.mouseovered_link = undefined;
    this.#createDomNode();
    this.#addEventListeners();
    if (show_column_lines) {
      this.#createLines();
    }
    if (show_column_names) {
      this.#createColumnNames();
    }
    this.linear_gradient_colors_object = {};
    this.#createNodes();
    this.#createLinks();
  }
  #createDomNode() {
    this.dom_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.dom_node.appendChild(this.defs);
    set_attributes(this.dom_node, {
      width: this.plot_width,
      height: this.plot_height,
      id: "sankey_field",
      viewBox: `0 0 ${this.plot_width} ${this.plot_height}`,
    });
    this.dom_node.style.backgroundColor = this.plot_background_color;
    this.dom_container.appendChild(this.dom_node);
  }
  #getNodeInfo(e) {
    const selected_node =
      this.nodes[e.target.getAttribute("column")][
        e.target.getAttribute("position")
      ];
    let node_column = selected_node.column;
    let node_position = selected_node.position;
    const node_data = this.nodes_data_structure[node_column][node_position];
    const node_label = selected_node.label;
    const node_height = Math.max(
      node_data["left_side_sum"],
      node_data["right_side_sum"]
    );
    const number_of_links = node_data["links_references"].length;
    const left_side_sum = node_data["left_side_sum"];
    const right_side_sum = node_data["right_side_sum"];

    //  counting left side ande right side links
    let number_of_links_left = 0;
    let number_of_links_right = 0;
    for (const i in node_data["links_references"]) {
      const link = this.links_data[node_data["links_references"][i]["link_id"]];
      const second_node_col =
        node_data["links_references"][i]["second_node_column"];
      if (node_column > second_node_col) {
        if (!link.hasOwnProperty("link_type")) {
          number_of_links_left += 1;
        } else if (link["link_type"][1] === "L") {
          number_of_links_left += 1;
        } else if (link["link_type"][1] === "R") {
          number_of_links_right += 1;
        }
      } else if (node_column < second_node_col) {
        if (!link.hasOwnProperty("link_type")) {
          number_of_links_right += 1;
        } else if (link["link_type"][0] === "L") {
          number_of_links_left += 1;
        } else if (link["link_type"][0] === "R") {
          number_of_links_right += 1;
        }
      }
    }
    //  end

    if (this.column_names) {
      node_column = this.column_names[node_column];
    } else {
      node_column += this.start_column_count_from;
    }
    node_position += this.start_node_count_from;

    return {
      label: node_label,
      height: node_height,
      number_of_links: number_of_links,
      left_side_sum: left_side_sum,
      right_side_sum: right_side_sum,
      column: node_column,
      position: node_position,
      number_of_links_left: number_of_links_left,
      number_of_links_right: number_of_links_right,
    };
  }
  #getLinkInfo(e) {
    const link_id = e.target.getAttribute("links_array_id");
    const link_data = this.links_data[link_id];
    let f_column = parseInt(link_data["from"]["column"]);
    let t_column = parseInt(link_data["to"]["column"]);
    let f_node = parseInt(link_data["from"]["node"]);
    let t_node = parseInt(link_data["to"]["node"]);
    if (link_data.hasOwnProperty("reversed")) {
      let _ = f_column;
      f_column = t_column;
      t_column = _;
      _ = f_node;
      f_node = t_node;
      t_node = _;
    }
    const f_label =
      this.nodes_data_structure[f_column][f_node]["properties_object"]["label"];
    const t_label =
      this.nodes_data_structure[t_column][t_node]["properties_object"]["label"];
    let value = link_data["value"];
    // check if sublink
    const sublink_index = e.target.getAttribute("sublink_index");
    if (sublink_index) {
      value = link_data["sublinks"][sublink_index]["value"];
    }
    f_node += this.start_node_count_from;
    t_node += this.start_node_count_from;

    if (this.column_names) {
      f_column = this.column_names[f_column];
      t_column = this.column_names[t_column];
    } else {
      f_column += this.start_column_count_from;
      t_column += this.start_column_count_from;
    }

    return {
      from_column: f_column,
      to_column: t_column,
      from_node: f_node,
      to_node: t_node,
      from_label: f_label,
      to_label: t_label,
      value: value,
      sublink_data: sublink_index
        ? link_data["sublinks"][sublink_index]
        : undefined,
    };
  }
  #addEventListeners() {
    ////          MOUSE EVENT LISTENERS DEFINED BY USER
    const is_mozilla = navigator.userAgent
      .toLocaleLowerCase()
      .includes("firefox");
    let mozilla_is_moving = false;

    this.dom_node.addEventListener("click", (e) => {
      if (is_mozilla && mozilla_is_moving) {
        // fixes firefox specific issue, where click event is triggered after pointerup
        mozilla_is_moving = false;
        return;
      }

      if (
        e.target.getAttribute("identifier") === "SankeyNode" &&
        this.on_node_click_function
      ) {
        const node_div = e.target;
        const selected_node =
          this.nodes[node_div.getAttribute("column")][
            node_div.getAttribute("position")
          ];
        const node_data =
          this.nodes_data_structure[selected_node.column][
            selected_node.position
          ]["properties_object"];
        this.on_node_click_function(
          this.#getNodeInfo(e),
          node_data,
          node_div,
          e
        );
      }

      if (
        e.target.getAttribute("identifier") === "SankeyLink" &&
        this.on_link_click_function
      ) {
        const link_div = e.target;
        const link_data =
          this.links_data[e.target.getAttribute("links_array_id")];
        this.on_link_click_function(
          this.#getLinkInfo(e),
          link_data,
          link_div,
          e
        );
      }
    });
    ////          MOUSE EVENT LISTENERS TO MOVE NODES
    this.dom_node.addEventListener("pointerdown", (e) => {
      if (e.target.getAttribute("identifier") !== "SankeyNode") {
        return;
      }
      if (this.node_info_div) {
        this.dom_container.removeChild(this.node_info_div);
        this.node_info_div = undefined;
      }
      this.selected_node =
        this.nodes[e.target.getAttribute("column")][
          e.target.getAttribute("position")
        ];
      this.selected_node.mouse_locked = true;
      this.cursor_distance_from_node_top = Math.abs(
        e.clientY -
          this.dom_node.getBoundingClientRect().top -
          this.selected_node.current_y
      );
      this.selected_node.dom_rectangle.classList.add("focused_SankeyNode");
      this.dom_node.style.cursor = this.grabbing_node_cursor;
    });
    this.dom_node.addEventListener("pointermove", (e) => {
      if (!this.selected_node || !this.selected_node.mouse_locked) {
        return;
      }
      if (is_mozilla) {
        mozilla_is_moving = true;
      }
      this.selected_node.move(
        e.clientX,
        e.clientY - this.dom_node.getBoundingClientRect().top
      );
    });
    this.dom_node.addEventListener("pointerup", (e) => {
      if (!this.selected_node) {
        return;
      }
      this.selected_node.mouse_locked = false;
      this.selected_node.dom_rectangle.classList.remove("focused_SankeyNode");
      this.selected_node = undefined;
      this.dom_node.style.removeProperty("cursor");
      /* nodes can be redrawed to be on top of the links after being covered by them,
                 but it may not be the best choice, currently disabled
                for (let i in this.nodes){
                    for (let j in this.nodes[i]){
                        this.nodes[i][j].redraw()}}*/
    });
    ////          MOUSE EVENT LISTENERS TO SHOW LINKS OR NODES INFO
    this.dom_node.addEventListener("pointerover", (e) => {
      // if node hovered
      if (
        e.target.getAttribute("identifier") === "SankeyNode" &&
        !this.selected_node
      ) {
        this.dom_node.style.cursor = this.hover_node_cursor;
        this.mouseovered_node =
          this.nodes[e.target.getAttribute("column")][
            e.target.getAttribute("position")
          ];

        let text_content = undefined;
        // execute callback function
        if (this.on_node_hover_function) {
          const div_ = e.target;
          const snode_ =
            this.nodes[div_.getAttribute("column")][
              div_.getAttribute("position")
            ];
          const node_d_ =
            this.nodes_data_structure[snode_.column][snode_.position][
              "properties_object"
            ];
          text_content = this.on_node_hover_function(
            this.#getNodeInfo(e),
            node_d_,
            div_,
            e
          );
        }

        // create element
        const node_info_div = document.createElement("div");
        node_info_div.classList.add("node_info_div");
        node_info_div.innerHTML = text_content;
        this.dom_container.appendChild(node_info_div);
        // position info
        let potential_y_coord =
          this.mouseovered_node.current_y -
          node_info_div.offsetHeight +
          this.dom_container.getBoundingClientRect().top -
          5;
        let potential_x_coord =
          this.mouseovered_node.current_x +
          this.dom_container.getBoundingClientRect().left +
          (this.mouseovered_node.width - node_info_div.offsetWidth) / 2;
        potential_y_coord = potential_y_coord > 0 ? potential_y_coord : 0;
        potential_x_coord = potential_x_coord > 0 ? potential_x_coord : 0;
        if (potential_y_coord === 0) {
          potential_x_coord += node_info_div.offsetWidth;
        }
        node_info_div.style.top = `${potential_y_coord}px`;
        node_info_div.style.left = `${potential_x_coord}px`;
        this.node_info_div = node_info_div;
      }
      // if link hovered
      else if (e.target.getAttribute("identifier") === "SankeyLink") {
        if (!this.selected_node) {
          this.dom_node.style.cursor = this.hover_link_cursor;
          this.mouseovered_link = e.target;
          this.mouseovered_link.classList.add("hovered_SankeyLink");

          let text_content = undefined;
          // execute callback function
          if (this.on_link_hover_function) {
            const link_div = e.target;
            const link_data =
              this.links_data[e.target.getAttribute("links_array_id")];
            text_content = this.on_link_hover_function(
              this.#getLinkInfo(e),
              link_data,
              link_div,
              e
            );
          }
          // create element
          const link_info_div = document.createElement("div");
          link_info_div.classList.add("link_info_div");
          link_info_div.innerHTML = text_content;
          // Positioning info div
          this.dom_container.appendChild(link_info_div);
          const potential_y_coord = e.clientY - link_info_div.offsetHeight - 15;
          const potential_x_coord = e.clientX + 15;
          link_info_div.style.top = `${
            potential_y_coord > 0 ? potential_y_coord : 0
          }px`;
          link_info_div.style.left = `${
            potential_x_coord > 0 ? potential_x_coord : 0
          }px`;
          this.link_info_div = link_info_div;
        }
      }
    });
    ////          MOUSE EVENT LISTENERS TO HIDE LINKS OR NODES INFO
    this.dom_node.addEventListener("pointerout", (e) => {
      if (e.target.getAttribute("identifier") === "SankeyNode") {
        if (!this.selected_node) {
          this.dom_node.style.removeProperty("cursor");
        }
        if (this.node_info_div) {
          this.dom_container.removeChild(this.node_info_div);
          this.node_info_div = undefined;
        }
      } else if (e.target.getAttribute("identifier") === "SankeyLink") {
        if (!this.selected_node) {
          this.dom_node.style.removeProperty("cursor");
        }
        if (this.link_info_div) {
          this.mouseovered_link.classList.remove("hovered_SankeyLink");
          this.dom_container.removeChild(this.link_info_div);
          this.link_info_div = undefined;
        }
      }
    });
  }
  #createLines() {
    for (let i = 0; i < this.last_column - this.first_column - 1; i++) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      set_attributes(line, {
        x1: this.column_width * (i + 1),
        x2: this.column_width * (i + 1),
        y1: 0,
        y2: this.plot_height,
        stroke: this.line_definition_object["stroke"],
        "stroke-width": this.line_definition_object["stroke-width"],
        "stroke-opacity": this.line_definition_object["stroke-opacity"],
        "stroke-dasharray": this.line_definition_object["stroke-dasharray"],
      });
      this.dom_node.appendChild(line);
    }
  }
  #createColumnNames() {
    const MAX_NUMBER_OF_NAMES_IN_RANGE = 10;
    const n_current_range = this.last_column - this.first_column;

    const increment = Math.ceil(n_current_range / MAX_NUMBER_OF_NAMES_IN_RANGE);
    const all_start_from = Math.floor(
      (this.nodes_data_structure.length % increment) / 2
    );

    const start_from =
      all_start_from +
      Math.floor((this.first_column - all_start_from) / increment) * increment -
      this.first_column;

    for (let i = start_from; i < n_current_range; i += increment) {
      const number = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      number.textContent = this.column_names
        ? this.column_names[i + this.first_column]
        : i + this.first_column + this.start_column_count_from;
      set_attributes(number, {
        x: this.column_width / 2 + i * this.column_width,
        y: 10,
        "text-anchor": "middle",
        "dominant-baseline": "hanging",
        style: `font-size:${this.column_names_style["font-size"]};fill:${this.column_names_style["color"]};
                opacity:${this.column_names_style["opacity"]};font-weight:${this.column_names_style["font-weight"]}`,
      });
      this.dom_node.appendChild(number);
    }
  }
  #createNodes() {
    // PROBABLY NEEDS TO BE REFACTORED, NO NEED TO SEPARATE ALL THOSE CASES

    //first step - extracting informations which nodes outside columns are to be created (one node out of range) + links to be created
    const out_of_column_range_nodes = [];
    this.links_to_create_indexes = [];
    for (
      let column_index = this.first_column;
      column_index < this.last_column;
      column_index++
    ) {
      for (const node_index in this.nodes_data_structure[column_index]) {
        for (const link_index in this.nodes_data_structure[column_index][
          node_index
        ]["links_references"]) {
          const link_ref =
            this.nodes_data_structure[column_index][node_index][
              "links_references"
            ][link_index];
          this.links_to_create_indexes.push(link_ref["link_id"]);
          if (
            link_ref["second_node_column"] < this.first_column ||
            link_ref["second_node_column"] >= this.last_column
          ) {
            out_of_column_range_nodes.push({
              column: link_ref["second_node_column"],
              position: link_ref["second_node_position"],
            });
            //this.links_to_create_indexes.push(link_ref['link_id']) // probably unnecessary
          }
        }
      }
    }

    this.nodes = {};
    //second step - extracting informations which nodes outside columns are to be created (two nodes out of range)
    if (this.show_links_out_of_range) {
      const number_of_columns = this.nodes_data_structure.length;
      // choosing column range to be checked
      const check_range =
        number_of_columns - this.last_column > this.first_column
          ? [
              this.first_column - this.longest_link_length > 0
                ? this.first_column - this.longest_link_length
                : 0,
              this.first_column,
            ]
          : [
              this.last_column,
              this.last_column + this.longest_link_length < number_of_columns
                ? this.last_column + this.longest_link_length
                : number_of_columns,
            ];

      for (
        let column_index = check_range[0];
        column_index < check_range[1];
        column_index++
      ) {
        for (const node_index in this.nodes_data_structure[column_index]) {
          for (const link_index in this.nodes_data_structure[column_index][
            node_index
          ]["links_references"]) {
            const link_ref =
              this.nodes_data_structure[column_index][node_index][
                "links_references"
              ][link_index];
            if (
              link_ref["second_node_column"] < this.first_column ||
              link_ref["second_node_column"] >= this.last_column
            ) {
              out_of_column_range_nodes.push({
                column: link_ref["second_node_column"],
                position: link_ref["second_node_position"],
              });
              this.links_to_create_indexes.push(link_ref["link_id"]);
            }
          }
        }
      }
    }
    this.links_to_create_indexes = [...new Set(this.links_to_create_indexes)];
    // third step - creating nodes that are in range
    for (
      let column_index = this.first_column;
      column_index < this.last_column;
      column_index++
    ) {
      if (!this.nodes.hasOwnProperty(column_index)) {
        this.nodes[column_index] = {};
      }
      for (
        let node_index = 0;
        node_index < this.nodes_data_structure[column_index].length;
        node_index++
      ) {
        const node = this.nodes_data_structure[column_index][node_index];
        // LABEL
        let label = "";
        if (node["properties_object"].hasOwnProperty("label")) {
          label = node["properties_object"]["label"];
        }
        // COLOR
        let color = this.default_nodes_color;
        if (this.label_colors_object.hasOwnProperty(label)) {
          color = this.label_colors_object[label];
        }
        if (node["properties_object"].hasOwnProperty("color")) {
          color = node["properties_object"]["color"];
        }
        // WIDTH
        let width = 0;
        if (node["properties_object"].hasOwnProperty("width")) {
          width =
            this.column_width * parseFloat(node["properties_object"]["width"]);
        } else {
          width = this.column_width * this.nodes_width_percent;
        }

        this.nodes[column_index][node_index] = new SankeyNode(
          (column_index - this.first_column) * this.column_width +
            (this.column_width - width) / 2 +
            node["horizontal_shift"] *
              (this.column_width / this.last_column_width),
          node["y"] + node["vertical_shift"],
          width,
          node["height"],
          this,
          column_index,
          node_index,
          color,
          label,
          node["properties_object"]
        );
      }
    }

    // fourth step - creating remaining nodes
    for (const i in out_of_column_range_nodes) {
      const column = out_of_column_range_nodes[i]["column"];
      const position = out_of_column_range_nodes[i]["position"];
      if (!this.nodes.hasOwnProperty(column)) {
        this.nodes[column] = {};
      }
      const node = this.nodes_data_structure[column][position];
      // LABEL
      let label = "";
      if (node["properties_object"].hasOwnProperty("label")) {
        label = node["properties_object"]["label"];
      }
      // COLOR
      let color = this.default_nodes_color;
      if (this.label_colors_object.hasOwnProperty(label)) {
        color = this.label_colors_object[label];
      }
      if (node["properties_object"].hasOwnProperty("color")) {
        color = node["properties_object"]["color"];
      }
      // WIDTH
      let width = 0;
      if (node["properties_object"].hasOwnProperty("width")) {
        width =
          this.column_width * parseFloat(node["properties_object"]["width"]);
      } else {
        width = this.column_width * this.nodes_width_percent;
      }

      this.nodes[column][position] = new SankeyNode(
        (column - this.first_column) * this.column_width +
          (this.column_width - width) / 2 +
          node["horizontal_shift"] *
            (this.column_width / this.last_column_width),
        node["y"] + node["vertical_shift"],
        width,
        node["height"],
        this,
        column,
        position,
        color,
        label,
        node["properties_object"]
      );
    }
  }
  #createLinks() {
    this.links_to_create_indexes.sort((a, b) => {
      return a - b;
    });
    for (const i in this.links_to_create_indexes) {
      const link = this.links_data[this.links_to_create_indexes[i]];
      let link_type = "RL";
      if (link.hasOwnProperty("link_type")) {
        link_type = link["link_type"];
      }
      const start_node =
        this.nodes[link["from"]["column"]][link["from"]["node"]];
      const end_node = this.nodes[link["to"]["column"]][link["to"]["node"]];
      const height = link["value"] * this.node_height_unit;
      let link_color = link.hasOwnProperty("color") ? link["color"] : undefined;
      switch (link_type) {
        case "RL":
          new SankeyLinkRL(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color
          );
          break;
        case "LR":
          new SankeyLinkLR(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color
          );
          break;
        case "LL":
          new SankeyLinkLL(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color
          );
          break;
        case "RR":
          new SankeyLinkRR(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color
          );
          break;
        default:
          throw new Error("NOT A VALID LINK TYPE");
      }
      // create sublinks
      if (link.hasOwnProperty("sublinks")) {
        for (let sublink_index in link["sublinks"]) {
          sublink_index = parseInt(sublink_index);
          const sublink_data = link["sublinks"][sublink_index];
          // sublink data has format {value, shift, label(?)...}
          // pass same height as parent link, change to prper height inside constructor
          link_color = sublink_data.hasOwnProperty("color")
            ? sublink_data["color"]
            : undefined;
          switch (link_type) {
            case "RL":
              new SankeyLinkRL(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, sublink_index]
              );
              break;
            case "LR":
              new SankeyLinkLR(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, sublink_index]
              );
              break;
            case "LL":
              new SankeyLinkLL(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, sublink_index]
              );
              break;
            case "RR":
              new SankeyLinkRR(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, sublink_index]
              );
              break;
            default:
              throw new Error("NOT A VALID LINK TYPE");
          }
        }
      }
    }
    // redraw nodes
    for (const i in this.nodes) {
      for (const j in this.nodes[i]) {
        this.nodes[i][j].redraw();
      }
    }
  }
  clearData() {
    this.nodes_data_structure = undefined;
    this.links_data = undefined;
    this.column_names = undefined;
    this.nodes = undefined;
    this.defs = undefined;
  }
}
class SankeyNode {
  constructor(
    x,
    y,
    width,
    height,
    sankey_plot_object,
    column,
    position,
    color = "blue",
    label = "",
    properties_object = {}
  ) {
    this.original_x = x;
    this.original_y = y;
    this.current_x = x;
    this.current_y = y;
    this.column = column;
    this.position = position;
    this.original_color = color;
    this.width = width;
    this.height = height;
    this.label = label;
    this.properties_object = properties_object;
    this.links = [];
    this.sankey_plot_object = sankey_plot_object;
    this.dom_group_node = undefined;
    this.dom_rectangle = undefined;
    this.dom_label = undefined; // node text disabled, but do not remove
    this.mouse_locked = false;
    this.#createDomElement();
  }
  #createDomElement() {
    this.dom_group_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    this.dom_rectangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    /* NODE TEXT DISABLED
        this.dom_label = document.createElementNS( "http://www.w3.org/2000/svg",'text')
        this.dom_label.classList.add('node_text')
        */
    this.sankey_plot_object.dom_node.appendChild(this.dom_group_node);
    this.dom_group_node.appendChild(this.dom_rectangle);
    /*          NODE TEXT DISABLED
        this.dom_label.textContent = this.label
        this.dom_group_node.appendChild(this.dom_label)
        // TEXT ATTRIBUTES
        set_attributes(this.dom_label, {'x':this.width/2, 'y':this.height/2, 'text-anchor': 'middle',
            'dominant-baseline': 'middle', 'identifier': 'SankeyNode', 'column': this.column,
            'position': this.position})
         */
    this.dom_group_node.style.transform = `translate(${this.original_x}px, ${this.original_y}px)`;
    // RECTANGLE ATTRIBUTES
    set_attributes(this.dom_rectangle, {
      width: `${this.width}px`,
      height: this.height,
      fill: this.original_color,
      x: 0,
      y: 0,
      identifier: "SankeyNode",
      column: this.column,
      position: this.position,
    });
  }
  move(new_x, new_y) {
    // New cooridnates are set based on clientX and clientY mouse position. SVG rectangle's x and y attributes
    // mean its left-upper corner coordinates. To adress this problem, coordinates from parameters must be
    // normalized, so the CENTER of rectangle will be in current mouse position
    /*
        if (this.sankey_plot_object.node_move_x){
            let new_x_pos = new_x-this.width/2 + this.sankey_plot_object.dom_node.parentNode.scrollLeft
            this.sankey_plot_object.nodes_data_structure[this.column][this.position]['horizontal_shift'] += new_x_pos - this.current_x
            this.current_x = new_x_pos
        }
         */
    if (this.sankey_plot_object.node_move_y) {
      const distance_from_top = 0;
      const new_y_pos =
        new_y -
        distance_from_top +
        -this.sankey_plot_object.cursor_distance_from_node_top +
        this.sankey_plot_object.dom_node.parentNode.scrollTop;

      this.sankey_plot_object.nodes_data_structure[this.column][this.position][
        "vertical_shift"
      ] += new_y_pos - this.current_y;
      this.current_y = new_y_pos;
    }
    this.dom_group_node.style.transform = `translate(${this.current_x}px, ${this.current_y}px)`;
    //updating links positions
    for (const i in this.links) {
      this.links[i].updateD();
    }
    this.redraw();
  }
  redraw() {
    this.sankey_plot_object.dom_node.removeChild(this.dom_group_node);
    this.sankey_plot_object.dom_node.appendChild(this.dom_group_node);
  }
  addLink(link) {
    this.links.push(link);
  }
}
class SankeyLink {
  constructor(
    node1,
    node2,
    height,
    sankey_plot_object,
    links_array_index,
    color = undefined,
    sublink_data = undefined
  ) {
    this.node1 = node1;
    this.node2 = node2;
    this.height = height;
    this.sankey_plot_object = sankey_plot_object;
    this.links_array_index = links_array_index;
    this.fill = color;
    this.opacity = undefined;
    this.dom_node = undefined;
    this.node1_render_height = 0;
    this.node2_render_height = 0;
    this.node1.addLink(this);
    this.node2.addLink(this);
    this.node1_render_height =
      this.sankey_plot_object.links_data[this.links_array_index][
        "left_side_rel_to_node_height"
      ];
    this.node2_render_height =
      this.sankey_plot_object.links_data[this.links_array_index][
        "right_side_rel_to_node_height"
      ];
    this.sublink_data = undefined;
    if (sublink_data) {
      this.sublink_data = sublink_data[0];
      this.node1_render_height += this.height * this.sublink_data["shift"];
      this.node2_render_height += this.height * this.sublink_data["shift"];
      this.parent_link_height = this.height;
      this.height =
        this.sankey_plot_object.node_height_unit * this.sublink_data["value"];
      this.sublink_index = sublink_data[1];
    }
    this.#linearGradient();
  }
  _calculateD(_x1, _x2, _y1, _y2, path_height, node1_width, node2_width) {}
  updateD() {
    this.dom_node.setAttribute(
      "d",
      this._calculateD(
        this.node1.current_x,
        this.node2.current_x,
        this.node1.current_y + this.node1_render_height,
        this.node2.current_y + this.node2_render_height,
        this.height,
        this.node1.width,
        this.node2.width
      )
    );
    //redraw link, so it's on top of other elemtents
    this.sankey_plot_object.dom_node.removeChild(this.dom_node);
    this.sankey_plot_object.dom_node.appendChild(this.dom_node);
  }
  #linearGradient() {
    if (
      this.sankey_plot_object.linear_gradient_links &&
      !this.fill &&
      !this.sublink_data
    ) {
      const color1 = this.node1.original_color;
      const color2 = this.node2.original_color;
      // if definition of this linear gradient is not yet created, then we need to create it and add it to definitions
      if (
        !this.sankey_plot_object.linear_gradient_colors_object.hasOwnProperty(
          color1
        )
      ) {
        this.sankey_plot_object.linear_gradient_colors_object[color1] = {};
      }
      if (
        !this.sankey_plot_object.linear_gradient_colors_object[
          color1
        ].hasOwnProperty(color2)
      ) {
        const linear = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "linearGradient"
        );
        set_attributes(linear, {
          id: `_${color1}_to_${color2}`,
          x1: "0%",
          x2: "100%",
          y1: "0%",
          y2: "0%",
        });
        const stop1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop"
        );
        stop1.setAttribute("offset", "10%");
        stop1.style.stopColor = color1;
        stop1.style.stopOpacity = "1";
        const stop2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop"
        );
        stop2.setAttribute("offset", "90%");
        stop2.style.stopColor = color2;
        stop2.style.stopOpacity = "1";
        linear.appendChild(stop1);
        linear.appendChild(stop2);
        this.sankey_plot_object.defs.appendChild(linear);
        this.sankey_plot_object.linear_gradient_colors_object[color1][
          color2
        ] = true;
      }
      this.fill = `url('#_${color1}_to_${color2}')`;
      this.opacity = this.sankey_plot_object.default_gradient_links_opacity;
    } else {
      if (!this.fill) {
        this.fill = this.sublink_data
          ? this.sankey_plot_object.default_sublinks_color
          : this.sankey_plot_object.default_links_color;
      }
      this.opacity = this.sublink_data
        ? this.sankey_plot_object.default_sublinks_opacity
        : this.sankey_plot_object.default_links_opacity;
    }
  }
  _createDomElement() {
    this.dom_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    set_attributes(this.dom_node, {
      identifier: "SankeyLink",
      links_array_id: this.links_array_index,
      fill: this.fill,
      "fill-opacity": this.opacity,
      d: this._calculateD(
        this.node1.original_x,
        this.node2.original_x,
        this.node1.original_y + this.node1_render_height,
        this.node2.original_y + this.node2_render_height,
        this.height,
        this.node1.width,
        this.node2.width
      ),
    });
    if (this.sublink_data) {
      this.dom_node.setAttribute("sublink_index", this.sublink_index);
    }
    this.sankey_plot_object.dom_node.appendChild(this.dom_node);
  }
}
class SankeyLinkRL extends SankeyLink {
  constructor(
    node1,
    node2,
    height,
    sankey_plot_object,
    links_array_index,
    color = undefined,
    sublink_data = undefined
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data
    );
    this._createDomElement();
  }
  _calculateD(x1, x2, y1, y2, path_height, node1_width, node2_width) {
    const half_way_x = (x1 + node1_width + x2) / 2;
    return `M ${
      x1 + node1_width
    } ${y1} C ${half_way_x} ${y1}, ${half_way_x} ${y2},
            ${x2} ${y2} l 0 ${path_height} C ${half_way_x} ${y2 + path_height},
            ${half_way_x} ${y1 + path_height}, ${x1 + node1_width} ${
      y1 + path_height
    } Z`;
  }
}
class SankeyLinkLR extends SankeyLink {
  constructor(
    node1,
    node2,
    height,
    sankey_plot_object,
    links_array_index,
    color = undefined,
    sublink_data = undefined
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data
    );
    this.left_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "left_side_curve"
      ];
    this.right_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "right_side_curve"
      ];
    if (this.sublink_data) {
      this.left_side_curve +=
        this.parent_link_height * (1 - this.sublink_data["shift"]) -
        this.height;
      this.right_side_curve +=
        this.parent_link_height * (1 - this.sublink_data["shift"]) -
        this.height;
    }
    this._createDomElement();
  }
  _calculateD(x1, x2, y1, y2, path_height, node1_width, node2_width) {
    const node_tail = 0;
    const arc_curve_left = this.left_side_curve;
    const arc_curve_right = this.right_side_curve;
    const falldown = 0;
    const half_way_x = (x1 + x2 + node2_width) / 2;
    return `M ${x1} ${
      y1 + path_height
    } l -${node_tail} 0 a ${arc_curve_left} ${arc_curve_left} 0, 0, 0,
         -${arc_curve_left} ${arc_curve_left} l 0 ${falldown}
        a ${arc_curve_left} ${arc_curve_left} 0, 0, 0, ${arc_curve_left} ${arc_curve_left}
        C ${half_way_x} ${
      y1 + path_height + 2 * arc_curve_left + falldown
    }, ${half_way_x} 
        ${y2 + path_height + 2 * arc_curve_right + falldown}, ${
      x2 + node2_width
    } ${y2 + path_height + 2 * arc_curve_right + falldown}
        l ${node_tail} 0 a ${arc_curve_right}, ${arc_curve_right}, 0, 0, 0,
        ${arc_curve_right} -${arc_curve_right} l 0 -${falldown}
        a ${arc_curve_right}, ${arc_curve_right},
        0, 0, 0, -${arc_curve_right} -${arc_curve_right} l -${node_tail} 0 l 0 -${path_height} l ${node_tail} 0
        a ${path_height + arc_curve_right} ${
      path_height + arc_curve_right
    }, 0, 0, 1,
        ${path_height + arc_curve_right}, ${
      path_height + arc_curve_right
    } l 0 ${falldown}
        a ${path_height + arc_curve_right} ${
      path_height + arc_curve_right
    }, 0, 0, 1,
        -${path_height + arc_curve_right}, ${
      path_height + arc_curve_right
    } l -${node_tail} 0
        C ${half_way_x} ${
      y2 + 2 * path_height + 2 * arc_curve_right + falldown
    }, ${half_way_x} ${y1 + 2 * path_height + 2 * arc_curve_left + falldown},
         ${x1} ${
      y1 + 2 * path_height + 2 * arc_curve_left + falldown
    } l -${node_tail} 0
        a ${path_height + arc_curve_left} ${
      path_height + arc_curve_left
    }, 0, 0, 1,
        -${path_height + arc_curve_left}, -${
      path_height + arc_curve_left
    } l 0 ${-falldown}
        a ${path_height + arc_curve_left} ${
      path_height + arc_curve_left
    }, 0, 0, 1,
        ${path_height + arc_curve_left}, -${
      path_height + arc_curve_left
    } l ${node_tail} 0 Z`;
  }
}
class SankeyLinkLL extends SankeyLink {
  constructor(
    node1,
    node2,
    height,
    sankey_plot_object,
    links_array_index,
    color = undefined,
    sublink_data = undefined
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data
    );
    this.left_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "left_side_curve"
      ];
    if (this.sublink_data) {
      this.left_side_curve +=
        this.parent_link_height * (1 - this.sublink_data["shift"]) -
        this.height;
    }
    this._createDomElement();
  }
  _calculateD(x1, x2, y1, y2, path_height, node1_width, node2_width) {
    const node_tail = 0;
    const arc_curve_distance = this.left_side_curve;
    const falldown = 0;
    const half_way_x = (x1 + x2) / 2;
    return `M ${x1} ${
      y1 + path_height
    } l -${node_tail} 0 a ${arc_curve_distance} ${arc_curve_distance} 0, 0, 0,
         -${arc_curve_distance} ${arc_curve_distance} l 0 ${falldown}
        a ${arc_curve_distance} ${arc_curve_distance} 0, 0, 0, ${arc_curve_distance} ${arc_curve_distance} l ${node_tail} 0
        C ${half_way_x} ${
      y1 + path_height + 2 * arc_curve_distance + falldown
    }, ${half_way_x} 
        ${y2}, ${x2} ${y2} l 0 ${path_height} C ${half_way_x} ${
      y2 + path_height
    }, ${half_way_x}
        ${y1 + 2 * path_height + 2 * arc_curve_distance + falldown}, ${x1} ${
      y1 + 2 * path_height + 2 * arc_curve_distance + falldown
    } l -${node_tail} 0 
        a ${path_height + arc_curve_distance} ${
      path_height + arc_curve_distance
    }, 0, 0, 1,
        -${path_height + arc_curve_distance}, -${
      path_height + arc_curve_distance
    } l 0 ${-falldown}
        a ${path_height + arc_curve_distance} ${
      path_height + arc_curve_distance
    }, 0, 0, 1,
        ${path_height + arc_curve_distance}, -${
      path_height + arc_curve_distance
    } l ${node_tail} 0 Z`;
  }
}
class SankeyLinkRR extends SankeyLink {
  constructor(
    node1,
    node2,
    height,
    sankey_plot_object,
    links_array_index,
    color = undefined,
    sublink_data = undefined
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data
    );
    this.right_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "right_side_curve"
      ];
    if (this.sublink_data) {
      this.right_side_curve +=
        this.parent_link_height * (1 - this.sublink_data["shift"]) -
        this.height;
    }
    this._createDomElement();
  }
  _calculateD(x1, x2, y1, y2, path_height, node1_width, node2_width) {
    const node_tail = 0;
    const arc_curve_distance = this.right_side_curve;
    const falldown = 0;
    const half_way_x = (x1 + x2 + node1_width + node2_width) / 2;
    return `M ${x1 + node1_width} ${y1} C ${half_way_x} ${y1}, ${half_way_x} 
        ${y2 + path_height + 2 * arc_curve_distance + falldown}, ${
      x2 + node2_width
    } ${y2 + path_height + 2 * arc_curve_distance + falldown}
        l ${node_tail} 0 a ${arc_curve_distance}, ${arc_curve_distance}, 0, 0, 0,
        ${arc_curve_distance} -${arc_curve_distance} l 0 -${falldown} a ${arc_curve_distance}, ${arc_curve_distance},
        0, 0, 0, -${arc_curve_distance} -${arc_curve_distance} l -${node_tail} 0 l 0 -${path_height} l ${node_tail} 0
        a ${path_height + arc_curve_distance} ${
      path_height + arc_curve_distance
    }, 0, 0, 1,
        ${path_height + arc_curve_distance}, ${
      path_height + arc_curve_distance
    } l 0 ${falldown}
        a ${path_height + arc_curve_distance} ${
      path_height + arc_curve_distance
    }, 0, 0, 1,
        -${path_height + arc_curve_distance}, ${
      path_height + arc_curve_distance
    } l -${node_tail} 0
        C ${half_way_x} ${
      y2 + 2 * path_height + 2 * arc_curve_distance + falldown
    }, ${half_way_x} ${y1 + path_height},
         ${x1 + node1_width} ${y1 + path_height} Z`;
  }
}
/**
 * Sets multiple attributes to a DOM element.
 * @param {HTMLElement} dom_element - Target DOM Element.
 * @param {Object} arg_val_object - Object.
 */
function set_attributes(dom_element, arg_val_object) {
  for (const i in arg_val_object) {
    dom_element.setAttribute(i, arg_val_object[i]);
  }
}
export { PlotCreator, set_attributes };
