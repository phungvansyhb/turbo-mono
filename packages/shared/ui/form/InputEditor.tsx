import React from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import type {FormInstance} from "antd";
import {Form} from "antd";
import classNames from "classnames";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  form: FormInstance;
  fieldName: string;
  label?: string;
  placeHolder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  description?: string;
  viewOnly?: boolean
};

export default function InputEditor({
  fieldName,
  form,
  label,
  placeHolder, viewOnly
}: Props) {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["code-block"],
      [{ color: [] }, { background: [] }],

      ["clean"],
    ],
    formula: false,
    syntax: false,
    history: {
      // Enable with custom configurations
      delay: 2500,
      userOnly: true,
    },
  };

  return (
    <Form.Item
      name={fieldName}
      label={label}
    >
      <ReactQuill
        className={classNames("rounded bg-white", { 'bg-gray-50 cursor-not-allowed': viewOnly })}
        theme="snow"
        modules={modules}
        placeholder={placeHolder}
        tabIndex={4}
        
        readOnly={viewOnly}
        onChange={(value) => {
          form.setFieldValue(fieldName, value)
        }}

      />
    </Form.Item>

  );
}
