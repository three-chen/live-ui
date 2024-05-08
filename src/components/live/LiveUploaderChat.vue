<script lang="ts">
import { Chat, RichText } from '@/modules';
import { useBulletsStore } from '@/stores/bulletScreen';
import { useChatsStore } from '@/stores/chat';
import { useSvgaStore } from '@/stores/svga';
import { useUserStore } from '@/stores/user';
import { UserInfoR } from 'live-service';
import { Decoder } from 'media-framework';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import LiveChatMessage from './live-chat-message/LiveChatMessage.vue';

export default {
    name: 'LiveUploaderChat',
    components: {
        LiveChatMessage
    },
    props: {
        room: {
            type: String
        }
    },
    setup(props) {
        const userStore = useUserStore();
        const user = computed(() => userStore.user);
        const isLogin = computed(() => userStore.isLogin);
        const chatsStore = useChatsStore();
        const chats = computed(() => chatsStore.chats);
        const bulletsStore = useBulletsStore()
        const svgaStore = useSvgaStore();

        const chatBox = ref<HTMLElement | null>(null);
        const richTextBox = ref<HTMLElement | null>(null);
        const richText = new RichText();

        const sendMessage = async () => {
            const message = await richText.getHTML();

            console.log("send message", message);
            Chat.sendMessage(message);
            richText.clear();

        }

        const onReceiveMessage = (user: UserInfoR, message: string) => {
            console.log("receive message");
            chatsStore.pushChats({ user, message })
            bulletsStore.pushBullets({ user, message })
            nextTick(() => {
                chatBox.value!.scrollTop = chatBox.value!.scrollHeight;
            })
        }

        const onReceiveGift = (message: string) => {
            svgaStore.sendGift(message)
            svgaStore.setIsGifted(true)
            console.log("receive gift", message)
        }

        const onStopLive = async () => {
            console.log("stop live");
            await Decoder.destroy()
        }

        onMounted(() => {
            richText.mount(richTextBox.value!);
            console.log('chat mounted', props.room, user);
            Chat.init(props.room!, onReceiveMessage, onReceiveGift, onStopLive, user.value?.id);
            Chat.connect();
        })

        onUnmounted(async () => {
            chatsStore.clearChats();
            bulletsStore.clearAllBullets();
            await Chat.destroy()
        })

        return {
            chats,
            isLogin,
            sendMessage,
            chatBox,
            richTextBox
        }
    }
}
</script>

<template>
    <div class="chatContainer">
        <div class="chatBox" ref="chatBox">
            <LiveChatMessage v-for="chat in chats" :key="chat.user.id" :user="chat.user" :message="chat.message">
            </LiveChatMessage>
        </div>
        <div class="richTextBox" ref="richTextBox"></div>
        <div class="sendMessage">
            <a-button type="primary" @click="sendMessage()" :disabled="!isLogin">发送信息</a-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chatContainer {
    position: relative;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .chatBox {
        width: 100%;
        height: 60%;
        padding: var(--padding-sm);
        overflow-y: auto;
        overflow-x: hidden;


        :deep(ul) {
            margin-left: 1rem;
        }

        :deep(img) {
            width: 100%;
        }
    }

    .richTextBox {
        width: 100%;
        height: 30%;
        overflow-y: auto;
        box-shadow: 0px -6px 8px 4px rgba(0, 0, 0, 0.09)
    }

    .sendMessage {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
}
</style>