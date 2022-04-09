import { Form, Formik } from "formik";
import isElectron from "is-electron";
import React, { useContext, useEffect } from "react";
import { object, pattern, size, string, optional } from "superstruct";
import { MainContext } from "../../api_context/api_based";
import { InputField } from "../../form-fields/InputField";
import { showErrorToast } from "../../lib/showErrorToast";
import { validateStruct } from "../../lib/validateStruct";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { ButtonLink } from "../../ui/ButtonLink";
import { Modal } from "../../ui/Modal";


const profileStruct = object({
  displayName: size(string(), 2, 50),
  username: pattern(string(), /^(\w){4,15}$/),
  bio: size(string(), 0, 160),
  avatarUrl: pattern(
    string(),
    /^https?:\/\/(www\.|)((a|p)bs.twimg.com\/(profile_images|sticky\/default_profile_images)\/(.*)\.(jpg|png|jpeg|webp)|avatars\.githubusercontent\.com\/u\/[^\s]+|github.com\/identicons\/[^\s]+|cdn.discordapp.com\/avatars\/[^\s]+\/[^\s]+\.(jpg|png|jpeg|webp))/
  ),
  bannerUrl: optional(
    pattern(
      string(),
      /^https?:\/\/(www\.|)(pbs.twimg.com\/profile_banners\/(.+)\/(.+)(?:\.(jpg|png|jpeg|webp))?|avatars\.githubusercontent\.com\/u\/)/
    )
  ),
});

interface EditProfileModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onEdit?: (data: {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string;
  }) => void;
}

const validateFn = validateStruct(profileStruct);

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onRequestClose,
  onEdit,
}) => {
  //const { conn, setUser } = useContext(WebSocketContext);
  //const { mutateAsync } = useTypeSafeMutation("editProfile");
  const { t } = useTypeSafeTranslation();
  const {user,client} = useContext(MainContext);

  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@rpc/page", {
        page: "edit-profile",
        opened: isOpen,
        modal: true,
        data: "",
      });
    }
  }, [isOpen]);


  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {isOpen ? (
        <Formik
          initialValues={{
            displayName: user!!.display_name,
            username: user!!.username,
            bio: user!!.bio,
            avatarUrl: user!!.avatar_url,
            bannerUrl: user!!.banner_url,
          }}
          validateOnChange={false}
          validate={()=>{}}
          onSubmit={(data)=>{
            client!!.send(
              "update_user_data",
              {
                display_name:data.displayName, 
                username:data.username, 
                bio:data.bio, 
                avatar_url:data.avatarUrl, 
                banner_url:data.bannerUrl});
              onRequestClose();
          }
        }
          
        >
          {({ isSubmitting }) => (
            <Form className={`flex-col w-full`}>
              <h4 className={`mb-2 text-primary-100`}>
                {t("pages.viewUser.editProfile")}
              </h4>
              <InputField
                className={`mb-4`}
                errorMsg={t(
                  "components.modals.editProfileModal.avatarUrlError"
                )}
                label={t("components.modals.editProfileModal.avatarUrlLabel")}
                name="avatarUrl"
              />
              <InputField
                className={`mb-4`}
                errorMsg={t(
                  "components.modals.editProfileModal.avatarUrlError"
                )}
                label={t("components.modals.editProfileModal.bannerUrlLabel")}
                name="bannerUrl"
              />
              <InputField
                className={`mb-4`}
                errorMsg={t(
                  "components.modals.editProfileModal.displayNameError"
                )}
                label={t("components.modals.editProfileModal.displayNameLabel")}
                name="displayName"
              />
              <InputField
                className={`mb-4`}
                errorMsg={t("components.modals.editProfileModal.usernameError")}
                label={t("components.modals.editProfileModal.usernameLabel")}
                name="username"
              />
              <InputField
                className={`mb-4`}
                errorMsg={t("components.modals.editProfileModal.bioError")}
                label={t("components.modals.editProfileModal.bioLabel")}
                textarea
                name="bio"
              />
              <div className={`flex pt-2 items-center`}>
                <Button loading={isSubmitting} type="submit" className={`mr-3`}>
                  {t("common.save")}
                </Button>
                <ButtonLink type="button" onClick={onRequestClose}>
                  {t("common.cancel")}
                </ButtonLink>
              </div>
            </Form>
          )}
        </Formik>
      ) : null}
    </Modal>
  );
};
