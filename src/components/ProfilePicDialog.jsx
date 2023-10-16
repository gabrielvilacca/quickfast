import { Button } from "@/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useFirestore } from "@/hooks/useFirestore";
import uploadToStorage from "@/utils/uploadToStorage";
import { ReloadIcon, UploadIcon } from "@radix-ui/react-icons";
import { reload, updateProfile } from "firebase/auth";

import { useState, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

export function ProfilePicDialog({ children, setRerender }) {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState("");
  const { updateDocument: updateUser } = useFirestore("users");
  const fileInputRef = useRef();

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const makeCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        localImageUrl,
        croppedAreaPixels,
        rotation
      );
      return croppedImage;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const onFileSelected = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(e);

      if (!selectedFile) {
        alert("Por favor, selecione um arquivo.");
        return;
      }

      if (!selectedFile.type.includes("image")) {
        alert("Por favor, selecione uma imagem.");
        return;
      }

      if (selectedFile.size > 1500000) {
        // Tamanho menor que 1,5MB
        alert("Por favor, selecione uma imagem menor do que 1,5 MB.");
        return;
      }

      const localUrl = URL.createObjectURL(selectedFile);
      setLocalImageUrl(localUrl);
    }
  };

  const fetchBlob = async (blobUrl) => {
    const response = await fetch(blobUrl);
    return response.blob();
  };

  const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type });
  };

  const uploadCroppedImage = async () => {
    setIsPending(true);
    try {
      const croppedImage = await makeCroppedImage();
      const blob = await fetchBlob(croppedImage); // Este é o valor de 'croppedImage' do seu state
      const file = blobToFile(blob, "profile-pic.jpg"); // Você pode escolher outro nome se quiser
      const downloadUrl = await uploadToStorage(
        file,
        `users/${user.uid}`,
        "profilePic"
      );

      await updateUser(user.uid, {
        profilePic: downloadUrl,
      });
      await updateProfile(user, { photoURL: downloadUrl });
      await reload(user);

      setRerender((prev) => !prev);
    } catch (error) {
      console.error("Erro ao atualizar o perfil: ", error);
    }

    setIsPending(false);
    setOpen(false);
    setLocalImageUrl("");
  };

  useEffect(() => {
    return () => {
      setLocalImageUrl("");
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Foto de perfil</DialogTitle>
          <DialogDescription>Altere a sua foto de perfil.</DialogDescription>
        </DialogHeader>
        {!localImageUrl && (
          <div
            className="mt-2.5 bg-primary-foreground h-64 border border-border rounded-lg flex justify-center items-center"
            style={{
              backgroundImage: `url(${user.photoURL?.replace("=s96-c", "")})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            role="button"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="p-2.5 rounded-md">
              <UploadIcon className="text-primary w-8 h-8" />
            </div>
          </div>
        )}
        {localImageUrl && (
          <div className="mt-5 relative h-64">
            <Cropper
              image={localImageUrl}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        <input
          onChange={onFileSelected}
          accept="image/*"
          ref={fileInputRef}
          type="file"
          className="hidden"
        />
        <DialogFooter className="mt-1">
          <Button disabled={isPending} onClick={uploadCroppedImage}>
            {isPending && <ReloadIcon className="mr-2 animate-spin" />}
            {isPending ? "Salvando a foto..." : "Salvar nova foto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
