import { Button, ColorPicker, Container, Element, Label, SelectInput, SliderInput, TextInput, BooleanInput } from '@playcanvas/pcui';

import { Pose } from '../camera-poses';
import { localize } from './localization';
import { Events } from '../events';
import { ExportType, SceneExportOptions } from '../file-handler';
import { AnimTrack, ExperienceSettings } from '../splat-serialize';
import sceneExport from './svg/export.svg';

const createSvg = (svgString: string, args = {}) => {
    const decodedStr = decodeURIComponent(svgString.substring('data:image/svg+xml,'.length));
    return new Element({
        dom: new DOMParser().parseFromString(decodedStr, 'image/svg+xml').documentElement,
        ...args
    });
};

const removeKnownExtension = (filename: string) => {
    // remove known extensions
    const knownExtensions = ['.compressed.ply', '.ply', '.splat', '.html', '.zip'];

    for (let i = 0; i < knownExtensions.length; ++i) {
        const ext = knownExtensions[i];
        if (filename.endsWith(ext)) {
            return filename.slice(0, -ext.length);
        }
    }

    return filename;
};

class ExportPopup extends Container {
    show: (exportType: ExportType, splatNames: string[], showFilenameEdit: boolean) => Promise<null | SceneExportOptions>;
    hide: () => void;
    destroy: () => void;

    constructor(events: Events, args = {}) {
        args = {
            id: 'export-popup',
            hidden: true,
            tabIndex: -1,
            ...args
        };

        super(args);

        // UI

        const dialog = new Container({
            id: 'dialog'
        });

        // header

        const header = new Container({
            id: 'header'
        });

        const headerText = new Label({
            id: 'header',
            text: localize('export.header')
        });

        header.append(createSvg(sceneExport, {
            id: 'icon'
        }));

        header.append(headerText);

        // content

        const content = new Container({ id: 'content' });

        // type

        const viewerTypeRow = new Container({
            class: 'row'
        });

        const viewerTypeLabel = new Label({
            class: 'label',
            text: localize('export.type')
        });

        const viewerTypeSelect = new SelectInput({
            class: 'select',
            defaultValue: 'html',
            options: [
                { v: 'html', t: localize('export.html') },
                { v: 'zip', t: localize('export.package') }
            ]
        });

        viewerTypeRow.append(viewerTypeLabel);
        viewerTypeRow.append(viewerTypeSelect);

        // viewer: camera start position

        const startRow = new Container({
            class: 'row'
        });

        const startLabel = new Label({
            class: 'label',
            text: localize('export.start-position')
        });

        const startSelect = new SelectInput({
            class: 'select',
            defaultValue: 'viewport',
            options: [
                { v: 'default', t: localize('export.default') },
                { v: 'viewport', t: localize('export.viewport') },
                { v: 'pose', t: localize('export.pose-camera') }
            ]
        });

        startRow.append(startLabel);
        startRow.append(startSelect);

        // viewer: animation

        const animationLabel = new Label({ class: 'label', text: localize('export.animation') });
        const animationSelect = new SelectInput({
            class: 'select',
            defaultValue: 'none',
            options: [
                { v: 'none', t: localize('export.animation-none') },
                { v: 'track', t: localize('export.animation-track') }
            ]
        });
        const animationRow = new Container({ class: 'row' });
        animationRow.append(animationLabel);
        animationRow.append(animationSelect);

        // viewer: clear color

        const colorRow = new Container({
            class: 'row'
        });

        const colorLabel = new Label({
            class: 'label',
            text: localize('export.background-color')
        });

        const colorPicker = new ColorPicker({
            class: 'color-picker',
            value: [1, 1, 1, 1]
        });

        colorRow.append(colorLabel);
        colorRow.append(colorPicker);

        // viewer: fov

        const fovRow = new Container({
            class: 'row'
        });

        const fovLabel = new Label({
            class: 'label',
            text: localize('export.fov')
        });

        const fovSlider = new SliderInput({
            class: 'slider',
            min: 10,
            max: 120,
            precision: 0,
            value: 60
        });

        fovRow.append(fovLabel);
        fovRow.append(fovSlider);

        // compress

        const compressRow = new Container({
            class: 'row'
        });

        const compressLabel = new Label({
            class: 'label',
            text: localize('export.ply-compress')
        });

        const compressBoolean = new BooleanInput({
            class: 'boolean',
            type: 'toggle'
        });

        compressRow.append(compressLabel);
        compressRow.append(compressBoolean);

        // splats

        const splatsRow = new Container({
            class: 'row'
        });

        const splatsLabel = new Label({
            class: 'label',
            text: localize('export.splats-select')
        });

        const splatsSelect = new SelectInput({
            class: 'select',
            defaultValue: 'ply',
            options: [
                { v: 'all', t: localize('export.splats-select.all') }
            ]
        });

        splatsRow.append(splatsLabel);
        splatsRow.append(splatsSelect);

        // spherical harmonic bands

        const bandsRow = new Container({
            class: 'row'
        });

        const bandsLabel = new Label({
            class: 'label',
            text: localize('export.sh-bands')
        });

        const bandsSlider = new SliderInput({
            class: 'slider',
            min: 0,
            max: 3,
            precision: 0,
            value: 3
        });

        bandsRow.append(bandsLabel);
        bandsRow.append(bandsSlider);

        // filename

        const filenameRow = new Container({
            class: 'row'
        });

        const filenameLabel = new Label({
            class: 'label',
            text: localize('export.filename')
        });

        const filenameEntry = new TextInput({
            class: 'text-input'
        });

        filenameRow.append(filenameLabel);
        filenameRow.append(filenameEntry);

        // content

        content.append(viewerTypeRow);
        content.append(startRow);
        content.append(animationRow);
        content.append(colorRow);
        content.append(fovRow);
        content.append(compressRow);
        content.append(splatsRow);
        content.append(bandsRow);
        content.append(filenameRow);

        // footer

        const footer = new Container({ id: 'footer' });

        const cancelButton = new Button({
            class: 'button',
            text: localize('popup.cancel')
        });

        const exportButton = new Button({
            class: 'button',
            text: localize('file.export')
        });

        footer.append(cancelButton);
        footer.append(exportButton);

        dialog.append(header);
        dialog.append(content);
        dialog.append(footer);

        this.append(dialog);

        // handlers

        let onCancel: () => void;
        let onExport: () => void;

        cancelButton.on('click', () => onCancel());
        exportButton.on('click', () => onExport());

        const keydown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onCancel();
                    break;
                case 'Enter':
                    if (!e.shiftKey) onExport();
                    break;
                default:
                    e.stopPropagation();
                    break;
            }
        };

        const updateExtension = (ext: string) => {
            filenameEntry.value = removeKnownExtension(filenameEntry.value) + ext;
        };

        compressBoolean.on('change', () => {
            updateExtension(compressBoolean.value ? '.compressed.ply' : '.ply');
        });

        viewerTypeSelect.on('change', () => {
            updateExtension(viewerTypeSelect.value === 'html' ? '.html' : '.zip');
        });

        const reset = (exportType: ExportType, splatNames: string[], hasPoses: boolean) => {
            const allRows = [
                viewerTypeRow, startRow, animationRow, colorRow, fovRow, compressRow, splatsRow, bandsRow, filenameRow
            ];

            const activeRows = {
                ply: [compressRow, splatsRow, bandsRow, filenameRow],
                splat: [splatsRow, filenameRow],
                viewer: [viewerTypeRow, startRow, animationRow, colorRow, fovRow, splatsRow, bandsRow, filenameRow]
            }[exportType];

            allRows.forEach((r) => {
                r.hidden = activeRows.indexOf(r) === -1;
            });

            // update splat list
            splatsSelect.options = [
                {
                    v: 'all',
                    t: localize('export.splats-select.all')
                },
                ...splatNames.map((s, i) => ({ v: i.toFixed(0), t: s }))
            ];
            splatsSelect.value = 'all';
            splatsSelect.enabled = splatNames.length > 1;

            bandsSlider.value = events.invoke('view.bands');

            // ply
            compressBoolean.value = false;

            // filename
            filenameEntry.value = splatNames[0];
            switch (exportType) {
                case 'ply':
                    updateExtension('.ply');
                    break;
                case 'splat':
                    updateExtension('.splat');
                    break;
                case 'viewer':
                    updateExtension(viewerTypeSelect.value === 'html' ? '.html' : '.zip');
                    break;
            }

            // viewer
            const bgClr = events.invoke('bgClr');

            startSelect.value = hasPoses ? 'pose' : 'viewport';
            startSelect.disabledOptions = hasPoses ? {} : { 'pose': startSelect.options[2].t };

            animationSelect.value = hasPoses ? 'track' : 'none';
            animationSelect.disabledOptions = hasPoses ? { } : { track: animationSelect.options[1].t };
            animationSelect.enabled = hasPoses;

            colorPicker.value = [bgClr.r, bgClr.g, bgClr.b];

            fovSlider.value = events.invoke('camera.fov');
        };

        this.show = (exportType: ExportType, splatNames: string[], showFilenameEdit: boolean) => {
            const frames = events.invoke('timeline.frames');
            const frameRate = events.invoke('timeline.frameRate');
            const orderedPoses = (events.invoke('camera.poses') as Pose[])
            .slice()
            .filter(p => p.frame >= 0 && p.frame < frames)
            .sort((a, b) => a.frame - b.frame);

            reset(exportType, splatNames, orderedPoses.length > 0);

            // filename is only shown in safari where file picker is not supported
            filenameRow.hidden = !showFilenameEdit;

            this.hidden = false;
            this.dom.addEventListener('keydown', keydown);
            this.dom.focus();

            const assemblePlyOptions = () : SceneExportOptions => {
                return {
                    filename: filenameEntry.value,
                    splatIdx: splatsSelect.value === 'all' ? 'all' : splatsSelect.value,
                    serializeSettings: {
                        maxSHBands: bandsSlider.value
                    },
                    compressedPly: compressBoolean.value
                };
            };

            const assembleSplatOptions = () : SceneExportOptions => {
                return {
                    filename: filenameEntry.value,
                    splatIdx: splatsSelect.value === 'all' ? 'all' : splatsSelect.value,
                    serializeSettings: { }
                };
            };

            const assembleViewerOptions = () : SceneExportOptions => {
                // extract camera starting pos
                let pose;
                switch (startSelect.value) {
                    case 'pose':
                        pose = orderedPoses?.[0];
                        break;
                    case 'viewport':
                        pose = events.invoke('camera.getPose');
                        break;
                }
                const p = pose?.position;
                const t = pose?.target;

                const startAnim = (() => {
                    switch (animationSelect.value) {
                        case 'none': return 'none';
                        case 'track': return 'animTrack';
                    }
                })();

                // extract camera animation
                const animTracks: AnimTrack[] = [];
                switch (startAnim) {
                    case 'none':
                        break;
                    case 'animTrack': {
                        // use camera poses
                        const times = [];
                        const position = [];
                        const target = [];
                        for (let i = 0; i < orderedPoses.length; ++i) {
                            const p = orderedPoses[i];
                            times.push(p.frame);
                            position.push(p.position.x, p.position.y, p.position.z);
                            target.push(p.target.x, p.target.y, p.target.z);
                        }

                        animTracks.push({
                            name: 'cameraAnim',
                            duration: frames / frameRate,
                            frameRate,
                            target: 'camera',
                            loopMode: 'repeat',
                            interpolation: 'spline',
                            keyframes: {
                                times,
                                values: { position, target }
                            }
                        });

                        break;
                    }
                }

                const experienceSettings: ExperienceSettings = {
                    camera: {
                        fov: fovSlider.value,
                        position: p ? [p.x, p.y, p.z] : null,
                        target: t ? [t.x, t.y, t.z] : null,
                        startAnim,
                        animTrack: startAnim === 'animTrack' ? 'cameraAnim' : null
                    },
                    background: {
                        color: colorPicker.value.slice()
                    },
                    animTracks
                };

                return {
                    filename: filenameEntry.value,
                    splatIdx: splatsSelect.value === 'all' ? 'all' : splatsSelect.value,
                    serializeSettings: {
                        maxSHBands: bandsSlider.value
                    },
                    viewerExportSettings: {
                        type: viewerTypeSelect.value,
                        experienceSettings
                    }
                };
            };

            return new Promise<null | SceneExportOptions>((resolve) => {
                onCancel = () => {
                    resolve(null);
                };

                onExport = () => {
                    switch (exportType) {
                        case 'ply':
                            resolve(assemblePlyOptions());
                            break;
                        case 'splat':
                            resolve(assembleSplatOptions());
                            break;
                        case 'viewer':
                            resolve(assembleViewerOptions());
                            break;
                    }
                };
            }).finally(() => {
                this.dom.removeEventListener('keydown', keydown);
                this.hide();
            });
        };

        this.hide = () => {
            this.hidden = true;
        };

        this.destroy = () => {
            this.hide();
            super.destroy();
        };
    }
}

export { ExportPopup };
