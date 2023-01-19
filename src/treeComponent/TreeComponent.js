import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  importJsonData,
  addNewFolder,
  editNodeDAta,
  treeSearchHandler,
} from '../features/tree/treeSlice';
import TreeStructure from '../treeStructure/TreeStructure';

import { Container } from '@mui/material';

const TreeComponent = (e) => {
  //redux state
  const { treeData } = useSelector((store) => store.treeContainer);
  const [node, setNode] = useState({
    name: '',
    spouse: '',
    location: '',
    birthYear: '',
    presentAddress: '',
  });

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [filterDataList, setFilterDataList] = useState(treeData);
  const [text, setText] = useState('');
  const nodeHandler = (props) => {
    // setNode(props);
    console.log(props);
    if (props.children === undefined) {
      props.children = [];
    }
    setNode({
      ...props,
      name: props.name ? props.name : '',
      spouse: props.spouse ? props.spouse : '',
      location: props.location ? props.location : '',
      birthYear: props.birthYear ? props.birthYear : '',
      presentAddress: props.presentAddress ? props.presentAddress : '',
      photo: props.photo ? props.photo : [],
    });
  };
  const nodeInfoChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setNode({ ...node, [name]: value });
  };

  useEffect(() => {
    if (
      node.name &&
      node.spouse &&
      node.location &&
      node.birthYear &&
      node.presentAddress &&
      node.photo
    ) {
      console.log('hello', node);
      dispatch(editNodeDAta(node));
    }
  });

  const jsonFileInputHandler = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      dispatch(importJsonData(json));
    };
  };
  const importJsonHandler = () => {
    fileInputRef.current.click();
  };

  const exportJSONHandler = () => {
    console.log('export', treeData);
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(treeData)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  };

  const searchHandler = (e) => {
    // dispatch(treeSearchHandler(e.target.value));
    const text = e.target.value.trim().toLowerCase();
    setText(text);
    const filterData = (data) => {
      const fildata = data.filter((item) => {
        if (
          item.name.toLowerCase().includes(text) &&
          item.children !== undefined
        ) {
          return item;
        } else if (item.children !== undefined) {
          filterData(item.children);
        }
      });
      if (fildata.length > 0) {
        const filterData = {
          ...treeData,
          children: fildata,
        };
        console.log('fill', filterData);
        setFilterDataList(filterData);
      } else {
        console.log('data not found');
        const filterData = {
          ...treeData,
          children: fildata,
        };
        console.log('fill', filterData);
        setFilterDataList(filterData);
      }
    };
    filterData(treeData.children);
  };

  return (
    <Fragment>
      <Container>
        <div>title</div>
        <input type='text' onChange={(e) => searchHandler(e)} />

        <TreeStructure
          data={text ? filterDataList : treeData}
          nodeHandler={nodeHandler}
        />

        <input
          type='file'
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={jsonFileInputHandler}
        />
        <button onClick={() => importJsonHandler()}> input</button>
        <button onClick={exportJSONHandler}>Export Jason</button>
        <button onClick={() => dispatch(addNewFolder({ treeData, node }))}>
          Add Family
        </button>
        <button>Print Family Tree</button>

        <form>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            name='name'
            value={node.name}
            onChange={nodeInfoChangeHandler}
          ></input>

          <label htmlFor='spouse'>Spouse</label>
          <input
            type='text'
            id='spouse'
            name='spouse'
            value={node.spouse}
            onChange={nodeInfoChangeHandler}
          ></input>

          <label htmlFor='location'>Location</label>
          <input
            type='text'
            id='location'
            name='location'
            value={node.location}
            onChange={nodeInfoChangeHandler}
          ></input>

          <label htmlFor='birth'>Birth Year</label>
          <input
            type='text'
            id='birth'
            name='birthYear'
            value={node.birthYear}
            onChange={nodeInfoChangeHandler}
          ></input>

          <label htmlFor='address'>Present Address</label>
          <input
            type='text'
            id='address'
            name='presentAddress'
            value={node.presentAddress}
            onChange={nodeInfoChangeHandler}
          ></input>
          <label htmlFor='photo'>Family Photo :</label>
          {node.photo &&
            node.photo.map((pic) => {
              console.log(pic);
              return <img src={pic} />;
            })}
        </form>
      </Container>
    </Fragment>
  );
};

export default TreeComponent;
