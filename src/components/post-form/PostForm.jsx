import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ imagePreview, setImagePreview ] = useState(null);

    // Load existing image preview when editing
    React.useEffect(() => {
        if (post && post.featuredImage) {
            try {
                const existingImageUrl = appwriteService.getFileView(post.featuredImage);
                setImagePreview(existingImageUrl);
            } catch (error) {
                console.error("Error loading image preview:", error);
            }
        }
    }, [ post ]);


    const submit = async (data) => {
        setIsSubmitting(true);
        try {
            if (post) {
                // UPDATING EXISTING POST
                const file = data.image[ 0 ] ? await appwriteService.uploadFile(data.image[ 0 ]) : null;

                if (file && file.$id) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const { image, ...updateData } = data;

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...updateData,
                    featuredImage: file ? file.$id : post.featuredImage,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    alert("Failed to update post");
                }
            } else {
                // CREATING NEW POST
                if (!data.image || !data.image[ 0 ]) {
                    alert("Please select an image");
                    setIsSubmitting(false);
                    return;
                }

                let userId;
                if (userData && userData.$id) {
                    userId = userData.$id;
                } else {
                    const currentUser = await authService.getCurrentUser();
                    if (!currentUser || !currentUser.$id) {
                        alert("Please login to create posts");
                        navigate("/login");
                        return;
                    }
                    userId = currentUser.$id;
                }

                const file = await appwriteService.uploadFile(data.image[ 0 ]);

                if (!file || !file.$id) {
                    console.error("File upload failed");
                    alert("Failed to upload image. Please try again.");
                    setIsSubmitting(false);
                    return;
                }

                const fileId = file.$id;

                const { image, ...postData } = data;

                const dbPost = await appwriteService.createPost({
                    ...postData,
                    featuredImage: fileId,
                    userId: userId
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    await appwriteService.deleteFile(fileId);
                    alert("Failed to create post");
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("An error occurred: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files[ 0 ];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [ watch, slugTransform, setValue ]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row flex-wrap gap-6 animate-fadeIn">
            {/* Left Column - Main Content */}
            <div className="w-full lg:w-2/3 space-y-6">
                {/* Title Input */}
                <div className="transform transition-all duration-300 hover:translate-x-1">
                    <Input
                        label="Title :"
                        placeholder="Enter your post title..."
                        className="mb-4"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">{errors.title.message}</p>
                    )}
                </div>

                {/* Slug Input */}
                <div className="transform transition-all duration-300 hover:translate-x-1">
                    <Input
                        label="Slug :"
                        placeholder="post-url-slug"
                        className="mb-4"
                        {...register("slug", { required: "Slug is required" })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    {errors.slug && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">{errors.slug.message}</p>
                    )}
                </div>

                {/* Rich Text Editor */}
                <div className="transform transition-all duration-300">
                    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-1/3 lg:pl-6">
                <div className="lg:sticky lg:top-24 space-y-6">
                    {/* Featured Image Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-slideInRight">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Featured Image
                        </h3>
                        <Input
                            label=""
                            type="file"
                            className="mb-4"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post })}
                            onChange={(e) => {
                                register("image").onChange(e);
                                handleImageChange(e);
                            }}
                        />

                        {/* Image Preview - FIXED */}
                        {imagePreview && (
                            <div className="w-full mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-xl transition-all duration-300">
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt={post ? "Current image" : "Preview"}
                                        className="w-full h-48 object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300 group-hover:scale-105"
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <div className="flex items-center justify-between text-white">
                                                <span className="text-sm font-semibold drop-shadow-lg">
                                                    {post ? "Current Image" : "New Image"}
                                                </span>
                                                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corner Badge */}
                                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                        Preview
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>

                    {/* Status & Submit Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-slideInRight animation-delay-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Publish Settings
                        </h3>
                        <Select
                            options={[ "active", "inactive" ]}
                            label="Status"
                            className="mb-4"
                            {...register("status", { required: true })}
                        />
                        <Button
                            type="submit"
                            bgColor={post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
                            className="w-full group relative overflow-hidden"
                            disabled={isSubmitting}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {post ? "Updating..." : "Submitting..."}
                                    </>
                                ) : (
                                    <>
                                        {post ? (
                                            <>
                                                <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Update Post
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Publish Post
                                            </>
                                        )}
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add CSS animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-slideInRight {
                    animation: slideInRight 0.6s ease-out;
                }
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </form>
    );
}
