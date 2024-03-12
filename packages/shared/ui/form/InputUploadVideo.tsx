import type { ChangeEvent } from "react";
import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import { Button, Checkbox, Form, message, Modal, Tabs } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { Loader2Icon, X } from "lucide-react";
import { api } from "~/utils/api";

const { TabPane } = Tabs;

type Props = {
    form: FormInstance<any>;
    fieldName: string;
    label?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    isViewOnly?: boolean;
};

const InputUploadVideo = ({
    fieldName,
    form,
    label,
    inputProps,
    isViewOnly,
}: Props) => {
    const { data: user } = useSession();
    const formValue = form.getFieldValue(fieldName);

    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [cursors, setCursors] = useState<Array<string>>();
    const [currentCursors, setCurrentCursor] = useState<string>();
    const [currentSelectFile, setcurrentSelectFile] = useState<string>();
    const [openModal, setOpenModal] = useState(false);
    const [currentTab, setCurrentTab] = useState("media");

    useEffect(() => {
        setcurrentSelectFile(formValue);
    }, [formValue]);

    const {
        data: uploaded,
        isLoading,
        refetch,
    } = api.image.getUploaded.useQuery(
        { nextCursor: currentCursors, userId: user?.user.id },
        { enabled: openModal },
    );
    const {
        data: uploadedVideo,
        isLoading: isLoadingVideoUploaded,
        refetch: refetchVideo,
    } = api.image.getVideoUploaded.useQuery(
        { nextCursor: currentCursors, userId: user?.user.id },
        { enabled: openModal },
    );


    const uploadVideo = async () => {
        if (video) {
            setLoading(true);
            const data = new FormData();
            data.append("file", video);
            data.append("upload_preset", "othouse");
            data.append("cloud_name", "cloudps");
            data.append("folder", "banhkeomeomeo");
            data.append("context", `userId=${user?.user.id}`);
            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/cloudps/video/upload`,
                    {
                        method: "POST",
                        body: data,
                    },
                );
                await response.json();
                if (response.ok) {
                    refetchVideo();
                    setCurrentTab("media");
                    setVideo(null);
                    setVideoPreview(null);
                } else {
                    message.error({ content: "Upload video thất bại" });
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
    };


    const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setVideo(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setVideoPreview(reader.result);
                }
            };
        }
    };

    const handleResetClick = () => {
        setVideoPreview(null);
        setVideo(null);
    };
    return (
        <Form.Item label={label}>
            <div>
                {form.getFieldValue(fieldName) ? (
                    <div className="relative w-max">
                        {!isViewOnly && (
                            <X
                                size={15}
                                className="absolute right-2 top-2 z-20 cursor-pointer border bg-white text-black"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setcurrentSelectFile(undefined);
                                    form.resetFields([fieldName]);
                                }}
                            />
                        )}
                        <video
                            src={form.getFieldValue(fieldName)}
                            controls
                            muted
                            className="cursor-pointer rounded border-2 border-dashed"
                            width={200}
                            height={200}
                        />

                    </div>
                ) : (
                    <Button type="default" onClick={() => setOpenModal(true)}>
                        Chọn file
                    </Button>
                )}
            </div>
            <Modal
                open={openModal}
                footer={null}
                onCancel={() => setOpenModal(false)}
            >
                <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
                    <TabPane tab="Media" key="media">
                        {isLoadingVideoUploaded && (
                            <div className="flex w-full justify-center">
                                <Loader2Icon className="animate-spin" />
                            </div>
                        )}
                        {uploadedVideo && (
                            <div className="grid max-h-[500px] grid-cols-2 gap-4 overflow-y-auto">
                                {uploadedVideo?.data.map((item) => (
                                    <div
                                        key={item.asset_id}
                                        className="flex flex-col items-center justify-center"
                                    >
                                        <div
                                            className="relative flex h-[140px] w-[220px] items-center justify-center rounded "
                                            onClick={() => {
                                                if (currentSelectFile === item.url) {
                                                    setcurrentSelectFile(undefined);
                                                }
                                                setcurrentSelectFile(item.url);
                                            }}
                                        >
                                            <Checkbox checked={currentSelectFile === item.url} className="absolute right-2 top-2 z-20" />
                                            {/* {currentSelectFile === item.url && (
                                                <CheckCircleTwoTone
                                                    twoToneColor="#52c41a"
                                                    className="absolute right-2 top-2 z-20"
                                                />
                                            )} */}
                                            <video
                                                src={item.url}
                                                controls
                                                className="w-full h-[140px]"
                                            />
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 flex w-full justify-between gap-2">
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
                                    type={"primary"}
                                    className="bg-primary "
                                    disabled={!cursors}
                                    onClick={() => {
                                        if (cursors) {
                                            const currentIndex =
                                                cursors?.findIndex((item) => item === currentCursors) -
                                                1;
                                            setCurrentCursor(cursors[currentIndex - 1]);
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    disabled={!uploaded?.next_cursor}
                                    type="dashed"
                                    onClick={() => {
                                        setCursors((cursors) =>
                                            cursors
                                                ? [...cursors, uploaded?.next_cursor]
                                                : [uploaded?.next_cursor],
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
                        <div className="my-6 h-max max-w-[min(500px,_100vw)] overflow-hidden">
                            <>
                                <div className="border-dashed h-[200px] border-2 border-gray-400  flex flex-col justify-center items-center">
                                    <input
                                        id="hidden-input-upload-video"
                                        type="file"
                                        className="hidden"
                                        onChange={handleVideoChange}
                                        accept="video/*"
                                    />
                                    {!videoPreview && (
                                        <label
                                            htmlFor="hidden-input-upload-video"
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className="px-3 py-1 mt-2 bg-gray-200 rounded-sm hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                                            >
                                                Chọn video
                                            </div>
                                        </label>
                                    )}

                                    <div>
                                        {videoPreview && (
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="w-full h-[195px]"
                                            />
                                        )}
                                    </div>
                                </div>
                            </>
                            <div className="flex justify-end gap-4 py-4">
                                <Button
                                    htmlType="button"
                                    disabled={!video}
                                    onClick={uploadVideo}
                                    loading={loading}
                                >
                                    Upload
                                </Button>
                                <Button
                                    htmlType="button"
                                    disabled={!video}
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

export default InputUploadVideo;
