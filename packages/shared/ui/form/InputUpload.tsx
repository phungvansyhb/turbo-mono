import type {ChangeEvent} from 'react'
import React, {useEffect, useState} from "react";
import type {FormInstance} from 'antd'
import {Button, Form, message, Modal, Tabs} from "antd";
import {CheckCircleTwoTone} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import {Loader2Icon, X} from "lucide-react";
import {api} from "~/utils/api";

const { TabPane } = Tabs;

type Props = {
    form: FormInstance<any>;
    fieldName: string;
    label?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    isViewOnly?: boolean
};

const InputUploadImage = ({ fieldName, form, label, inputProps, isViewOnly }: Props) => {
    const { data: user } = useSession();
    const formValue = form.getFieldValue(fieldName);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [cursors, setCursors] = useState<Array<string>>();
    const [currentCursors, setCurrentCursor] = useState<string>();
    const [currentSelectFile, setcurrentSelectFile] = useState<string>();
    const [openModal, setOpenModal] = useState(false);
    const [currentTab, setCurrentTab] = useState("media");

    useEffect(() => {
        setcurrentSelectFile(formValue);
    }, [formValue]);

    const { data: uploaded, isLoading, refetch } = api.image.getUploaded.useQuery(
        { nextCursor: currentCursors, userId: user?.user.id },
        { enabled: openModal }
    );

    const uploadImage = async () => {
        if (image) {
            setLoading(true);
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "othouse");
            data.append("cloud_name", "cloudps");
            data.append("folder", "banhkeomeomeo");
            data.append("context", `userId=${user?.user.id}`);
            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/cloudps/image/upload`,
                    {
                        method: "POST",
                        body: data,
                    }
                );
                await response.json();
                if (response.ok) {
                    refetch();
                    setCurrentTab("media");
                    setImage(null);
                    setPreview(null);
                } else {
                    message.error({ content: "Upload ảnh thất bại" })
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setPreview(reader.result);
                }
            };
        }
    };

    const handleResetClick = () => {
        setPreview(null);
        setImage(null);
    };
    return (
        <Form.Item label={label}>
            <div>
                {form.getFieldValue(fieldName) ? (
                    <div className="relative w-max">
                        {!isViewOnly && <X size={15}
                            className="absolute bg-white border top-2 right-2 text-black z-20 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setcurrentSelectFile(undefined);
                                form.resetFields([fieldName]);
                            }}
                        />}
                        <img
                            className="border-2 border-dashed rounded cursor-pointer"
                            width={200}
                            height={200}
                            src={form.getFieldValue(fieldName)}
                            alt="image"
                        />
                    </div>
                ) : (
                    <Button type="default" onClick={() => setOpenModal(true)}>
                        Chọn file
                    </Button>
                )}


            </div>
            <Modal open={openModal} footer={null} centered onCancel={() => setOpenModal(false)}>
                <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
                    <TabPane tab="Media" key="media">
                        {isLoading && (
                            <div className="w-full flex justify-center">
                                <Loader2Icon className="animate-spin" />
                            </div>
                        )}
                        {uploaded && (
                            <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                                {uploaded?.data.map((item: any) => (
                                    <div
                                        key={item.asset_id}
                                        className="relative w-[120px] h-[120px] border-2 border-dashed rounded flex items-center"
                                        onClick={() => {
                                            if (currentSelectFile === item.url) {
                                                setcurrentSelectFile(undefined);
                                            }
                                            setcurrentSelectFile(item.url);
                                        }}
                                    >
                                        {currentSelectFile === item.url && (
                                            <CheckCircleTwoTone
                                                twoToneColor="#52c41a"
                                                className="absolute top-2 right-2 z-20"
                                            />
                                        )}
                                        <img
                                            className=""
                                            src={item.url}
                                            alt="image"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 w-full justify-between flex gap-2">
                            <Button
                                onClick={() => {
                                    form.setFieldValue(fieldName, currentSelectFile);
                                    setOpenModal(false);
                                }}
                            >
                                Select
                            </Button>
                            <div className="space-x-2">
                                <Button
                                    type={'primary'}
                                    className="bg-primary "
                                    disabled={!cursors}
                                    onClick={() => {
                                        if (cursors) {
                                            const currentIndex =
                                                cursors?.findIndex((item) => item === currentCursors) - 1;
                                            setCurrentCursor(cursors[currentIndex - 1]);
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    disabled={!uploaded?.next_cursor}
                                    type='dashed'
                                    onClick={() => {
                                        setCursors(
                                            (cursors) =>
                                                cursors ? [...cursors, uploaded?.next_cursor] : [uploaded?.next_cursor]
                                        );
                                        setCurrentCursor(uploaded?.next_cursor);
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Upload" key="upload">
                        <div className="max-w-[min(500px,_100vw)] h-max overflow-hidden my-6">
                            <>
                                <div
                                    className="border-dashed h-[200px] border-2 border-gray-400  flex flex-col justify-center items-center">
                                    <input
                                        id="hidden-input-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    {!image && (
                                        <label
                                            htmlFor="hidden-input-upload"
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className="px-3 py-1 mt-2 bg-gray-200 rounded-sm hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                                                Chọn file
                                            </div>
                                        </label>
                                    )}

                                    <div>
                                        {preview && (
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="w-full h-[195px]"
                                            />
                                        )}
                                    </div>
                                </div>
                            </>
                            <div className="flex justify-end gap-4 py-4">
                                <Button
                                    htmlType="button"
                                    disabled={!image}
                                    onClick={uploadImage}
                                    loading={loading}
                                >
                                    Upload
                                </Button>
                                <Button
                                    htmlType="button"
                                    disabled={!image}
                                    onClick={handleResetClick}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>
        </Form.Item>
    );
};

export default InputUploadImage;
