import React from "react";
import { TopAppBar, TopAppBarSection } from "webiny-ui/TopAppBar";
import BackButton from "./BackButton";
import { Title } from "./Title";
import { FormSettingsButton } from "./FormSettingsButton";
import { FormSettingsDialog } from "./FormSettingsDialog";
import { useFormEditor } from "./context";

import { css } from "emotion";

const topBar = css({
    boxShadow: "1px 0px 5px 0px rgba(128,128,128,1)"
});

export default function Bar() {
    const { showSettings, hideSettings } = useFormEditor();

    return (
        <TopAppBar className={topBar} fixed>
            <TopAppBarSection style={{ width: "50%" }} alignStart>
                <BackButton />
                <Title />
            </TopAppBarSection>
            <TopAppBarSection style={{ width: "33%" }} alignEnd>
                <FormSettingsButton />
                <FormSettingsDialog open={showSettings} onClose={hideSettings} />
            </TopAppBarSection>
        </TopAppBar>
    );
}